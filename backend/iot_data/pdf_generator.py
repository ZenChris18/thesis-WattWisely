import io
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use("Agg")  # Use a non-interactive backend for matplotlib

from .influx_service import fetch_power_data
from .services import calculate_power_metrics

def build_power_usage_pdf(entity_ids, timeframe, device, interval=30, rate=11.7428):
    stop_time = "now()"

    # Fetch data
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
        total_prev = calculate_power_metrics(prev_raw.values(), interval, rate) if len(entity_ids) > 1 else None

    # Always compute pie chart for ALL devices
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
    pie_labels = list(pie_metrics.keys())
    pie_sizes = [m["average_power_w"] for m in pie_metrics.values()]

    energy_kwh = total_current["energy_kwh"] if total_current else sum(m["energy_kwh"] for m in current_metrics.values())

    # Start PDF
    buf = io.BytesIO()
    pdf = canvas.Canvas(buf, pagesize=letter)
    W, H = letter

    # === HEADER ===
    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(40, H - 50, "Power Usage Report")

    pdf.setFont("Helvetica", 12)
    pdf.drawString(40, H - 70, f"Selected Device(s): {', '.join(entity_ids)}")
    pdf.drawString(40, H - 85, f"Timeframe: {timeframe}")

    y_cursor = H - 120

    # === Line Chart ===
    first = entity_ids[0]
    times = [r["_time"] for r in current_raw[first]]
    powers = [r["_value"] for r in current_raw[first]]

    fig, ax = plt.subplots()
    ax.plot(powers)
    ax.set_title(f"{first} - Power Over Time")
    ax.set_ylabel("Watts")
    ax.set_xlabel("Sample Index")
    fig.tight_layout()
    img1 = io.BytesIO()
    fig.savefig(img1, format="PNG", bbox_inches="tight")
    plt.close(fig)
    img1.seek(0)
    pdf.drawImage(ImageReader(img1), 40, y_cursor - 180, width=520, height=160)

    y_cursor -= 200

    # === Energy Summary ===
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(40, y_cursor, f"Total Energy Used: {energy_kwh:.4f} kWh")
    y_cursor -= 30

    # === Bar Chart: Now vs Previous ===
    fig, ax = plt.subplots()
    now_val = total_current["energy_kwh"] if total_current else energy_kwh
    prev_val = total_prev["energy_kwh"] if total_prev else 0
    ax.bar(["Now", "Previous"], [now_val, prev_val], color=["#4CAF50", "#FFC107"])
    ax.set_ylabel("kWh")
    ax.set_title("Energy Usage: Now vs Previous")
    fig.tight_layout()
    img2 = io.BytesIO()
    fig.savefig(img2, format="PNG", bbox_inches="tight")
    plt.close(fig)
    img2.seek(0)
    pdf.drawImage(ImageReader(img2), 40, y_cursor - 160, width=260, height=150)

    # === Pie Chart: Full Breakdown (Always All Smartplugs) ===
    fig, ax = plt.subplots()
    ax.pie(pie_sizes, labels=pie_labels, autopct="%1.1f%%", startangle=90)
    ax.set_title("All Smartplugs: Appliance Power Breakdown")
    fig.tight_layout()
    img3 = io.BytesIO()
    fig.savefig(img3, format="PNG", bbox_inches="tight")
    plt.close(fig)
    img3.seek(0)
    pdf.drawImage(ImageReader(img3), 300, y_cursor - 160, width=260, height=150)

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
