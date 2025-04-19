# iot_data/pdf_generator.py
import io
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
import matplotlib.pyplot as plt

from .influx_service import fetch_power_data
from .services import calculate_power_metrics

def build_power_usage_pdf(entity_ids, timeframe, device, interval=30, rate=11.7428):
    """
    Returns a BytesIO buffer containing the rendered PDF.
    """
    stop_time = "now()"

    # --- 1. Fetch & calculate metrics just like in views.py ---
    current_raw = {e: fetch_power_data(e, timeframe, stop_time) for e in entity_ids}
    current_metrics = {
        e: calculate_power_metrics([data], interval, rate)
        for e, data in current_raw.items()
    }
    total_current = (calculate_power_metrics(current_raw.values(), interval, rate)
                     if len(entity_ids) > 1 else None)

    prev_map = {"-1h":("-2h","-1h"), "-1d":("-2d","-1d"), "-1w":("-2w","-1w")}
    total_prev = None
    if timeframe in prev_map:
        ps, pe = prev_map[timeframe]
        prev_raw = {e: fetch_power_data(e, ps, pe) for e in entity_ids}
        total_prev = (calculate_power_metrics(prev_raw.values(), interval, rate)
                      if len(entity_ids) > 1 else None)

    energy_kwh = (total_current["energy_kwh"]
                  if total_current
                  else sum(m["energy_kwh"] for m in current_metrics.values()))

    labels = list(current_metrics.keys())
    sizes  = [m["average_power_w"] for m in current_metrics.values()]

    # --- 2. Draw the PDF ---
    buf = io.BytesIO()
    pdf = canvas.Canvas(buf, pagesize=letter)
    W, H = letter

    # Title
    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(40, H - 40, "Power Usage Report")

    # Line chart (first device as example)
    first = entity_ids[0]
    times  = [r["_time"] for r in current_raw[first]]
    powers = [r["_value"] for r in current_raw[first]]
    fig, ax = plt.subplots()
    ax.plot(powers)
    ax.set_title(f"{first} Power over Time")
    ax.set_ylabel("Watts")
    img1 = io.BytesIO()
    fig.savefig(img1, format="PNG", bbox_inches="tight")
    plt.close(fig)
    img1.seek(0)
    pdf.drawImage(ImageReader(img1), 40, H - 300, width=520, height=200)

    # kWh card
    pdf.setFont("Helvetica", 14)
    pdf.drawString(40, H - 330, f"Total Energy (kWh) Used: {energy_kwh:.4f}")

    # Bar chart: Now vs Previous
    now_val  = total_current["energy_kwh"] if total_current else energy_kwh
    prev_val = total_prev["energy_kwh"]    if total_prev    else 0
    fig, ax = plt.subplots()
    ax.bar(["Now", "Previous"], [now_val, prev_val])
    ax.set_ylabel("kWh")
    ax.set_title("Energy: Now vs Previous")
    img2 = io.BytesIO()
    fig.savefig(img2, format="PNG", bbox_inches="tight")
    plt.close(fig)
    img2.seek(0)
    pdf.drawImage(ImageReader(img2), 40, H - 550, width=260, height=160)

    # Pie chart: appliance breakdown
    fig, ax = plt.subplots()
    ax.pie(sizes, labels=labels, autopct="%1.1f%%")
    ax.set_title("Appliance Power Breakdown")
    img3 = io.BytesIO()
    fig.savefig(img3, format="PNG", bbox_inches="tight")
    plt.close(fig)
    img3.seek(0)
    pdf.drawImage(ImageReader(img3), 300, H - 550, width=260, height=160)

    pdf.showPage()
    pdf.save()
    buf.seek(0)
    return buf

def pdf_response_for_request(request):
    """
    A thin wrapper that:
      1) Parses entity_ids, timeframe, device from request.GET
      2) Calls build_power_usage_pdf()
      3) Returns HttpResponse with application/pdf
    """
    # same defaults as your view
    all_entities = [
        "sonoff_1001e01d7b_power",
        "sonoff_1002163433_power",
        "sonoff_1001f80f23_power",
    ]
    device = request.GET.get("device", "all")
    entities = ([device] if device in all_entities and device != "all"
                else all_entities)
    timeframe = request.GET.get("start", "-1h")

    buf = build_power_usage_pdf(entities, timeframe, device)
    return HttpResponse(buf.read(), content_type="application/pdf")
