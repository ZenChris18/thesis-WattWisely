import io
import os
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from django.utils.timezone import localtime, now
import pytz
import matplotlib.pyplot as plt
import matplotlib

matplotlib.use("Agg")

from .influx_service import fetch_power_data
from .services import calculate_power_metrics
from names.models import Appliance

def get_friendly_name(entity_id):
    try:
        return Appliance.objects.get(entity_id=entity_id).name
    except Appliance.DoesNotExist:
        return entity_id

def format_timeframe(tf):
    return {
        "-1h": "Last Hour",
        "-1d": "Last Day",
        "-1w": "Last Week"
    }.get(tf, tf)

def build_power_usage_pdf(entity_ids, timeframe, device, interval=30, rate=11.7428):
    stop_time = "now()"
    current_raw = {e: fetch_power_data(e, timeframe, stop_time) for e in entity_ids}
    current_metrics = {
        e: calculate_power_metrics([data], interval, rate)
        for e, data in current_raw.items()
    }
    total_current = calculate_power_metrics(current_raw.values(), interval, rate) if len(entity_ids) > 1 else None

    prev_map = {"-1h": ("-2h", "-1h"), "-1d": ("-2d", "-1d"), "-1w": ("-2w", "-1w")}
    total_prev = None
    if timeframe in prev_map:
        ps, pe = prev_map[timeframe]
        prev_raw = {e: fetch_power_data(e, ps, pe) for e in entity_ids}
        total_prev = calculate_power_metrics(prev_raw.values(), interval, rate)

    all_entity_ids = [
        "sonoff_1001e01d7b_power",
        "sonoff_1002163433_power",
        "sonoff_1001f80f23_power",
    ]
    pie_raw = {e: fetch_power_data(e, timeframe, stop_time) for e in all_entity_ids}
    pie_metrics = {
        e: calculate_power_metrics([data], interval, rate)
        for e, data in pie_raw.items()
    }
    pie_labels = [get_friendly_name(e) for e in pie_metrics.keys()]
    pie_sizes = [m["average_power_w"] for m in pie_metrics.values()]
    energy_kwh = total_current["energy_kwh"] if total_current else sum(m["energy_kwh"] for m in current_metrics.values())

    # Philippine timezone setup
    timezone = pytz.timezone("Asia/Manila")
    philippine_time = localtime(now(), timezone)

    buf = io.BytesIO()
    pdf = canvas.Canvas(buf, pagesize=letter)
    W, H = letter
    margin = 40
    y = H - margin

    # === Centered Title ===
    pdf.setFont("Helvetica-Bold", 20)
    title = "WattWisely Power Usage Report"
    title_width = pdf.stringWidth(title, "Helvetica-Bold", 20)
    pdf.drawString((W - title_width) / 2, y - 20, title) 
    y -= 50

    # === Metadata ===
    pdf.setFont("Helvetica", 12)
    pdf.drawString(margin, y, f"Selected Device(s): {', '.join(get_friendly_name(e) for e in entity_ids)}")
    y -= 20
    pdf.drawString(margin, y, f"Timeframe: {format_timeframe(timeframe)}")
    y -= 30
    pdf.line(margin, y, W - margin, y)
    y -= 20

    # === Fixed Line Chart ===
    if len(entity_ids) > 1:
        # Aggregate data for multiple devices
        num_points = len(current_raw[entity_ids[0]])
        summed_powers = []
        for i in range(num_points):
            total = sum(current_raw[e][i]['_value'] for e in entity_ids)
            summed_powers.append(total)
        powers = summed_powers
        line_chart_title = "All Devices - Combined Power Over Time"
    else:
        # Single device case
        first = entity_ids[0]
        powers = [r["_value"] for r in current_raw[first]]
        line_chart_title = f"{get_friendly_name(first)} - Power Over Time"

    fig, ax = plt.subplots(figsize=(6.5, 4.5))
    ax.plot(powers, color="navy")
    ax.set_title(line_chart_title)
    ax.set_ylabel("Watts")
    ax.set_xlabel("Sample Index")
    fig.tight_layout()
    img1 = io.BytesIO()
    fig.savefig(img1, format="PNG", bbox_inches="tight")
    plt.close(fig)
    img1.seek(0)
    pdf.drawImage(ImageReader(img1), margin, y - 260, width=520, height=220)
    y -= 280

    # === Summary Table ===
    now_val = total_current["energy_kwh"] if total_current else energy_kwh
    prev_val = total_prev["energy_kwh"] if total_prev else None
    if prev_val:
        change_pct = ((now_val - prev_val) / prev_val) * 100
        change_str = f"{change_pct:+.1f}% vs previous"
    else:
        change_str = "No previous data available"

    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(margin, y, "Summary")
    y -= 20

    pdf.setFont("Helvetica", 12)
    pdf.drawString(margin, y, f"Total Energy Used: {energy_kwh:.4f} kWh")
    y -= 20
    pdf.drawString(margin, y, f"Change Compared to Previous: {change_str}")
    y -= 30

    # === Bar Chart ===
    fig, ax = plt.subplots(figsize=(4, 3.2))
    ax.bar(["Now", "Previous"], [now_val, prev_val or 0], color=["#4CAF50", "#FFC107"])
    ax.set_ylabel("kWh")
    ax.set_title("Now vs Previous Energy Usage")
    fig.tight_layout()
    img2 = io.BytesIO()
    fig.savefig(img2, format="PNG", bbox_inches="tight")
    plt.close(fig)
    img2.seek(0)
    pdf.drawImage(ImageReader(img2), margin, y - 200, width=280, height=170)

    # === Pie Chart ===
    fig, ax = plt.subplots(figsize=(4, 3.2))
    ax.pie(pie_sizes, labels=pie_labels, autopct="%1.1f%%", startangle=90)
    ax.set_title("Appliance Breakdown")
    fig.tight_layout()
    img3 = io.BytesIO()
    fig.savefig(img3, format="PNG", bbox_inches="tight")
    plt.close(fig)
    img3.seek(0)
    pdf.drawImage(ImageReader(img3), margin + 290, y - 200, width=280, height=170)

    y -= 220

    # === Footer Section ===
    pdf.setFont("Helvetica-Oblique", 10)
    pdf.drawString(margin, 30, "Generated by WattWisely • Stay efficient")
    timestamp = philippine_time.strftime("Generated on: %Y-%m-%d %H:%M:%S")
    time_width = pdf.stringWidth(timestamp, "Helvetica-Oblique", 10)
    pdf.drawString(W - margin - time_width, 30, timestamp)

    pdf.showPage()
    pdf.save()
    buf.seek(0)
    return buf

def pdf_response_for_request(request):
    all_entities = [
        "sonoff_1001e01d7b_power",
        "sonoff_1002163433_power",
        "sonoff_1001f80f23_power",
    ]
    device = request.GET.get("device", "all")
    entities = [device] if device in all_entities and device != "all" else all_entities
    timeframe = request.GET.get("start", "-1h")

    buf = build_power_usage_pdf(entities, timeframe, device)
    return HttpResponse(buf.read(), content_type="application/pdf")