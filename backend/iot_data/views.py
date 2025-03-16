from rest_framework.response import Response
from rest_framework.decorators import api_view
from .influx_service import fetch_power_data
from .services import calculate_power_metrics

@api_view(['GET'])
def power_data_view(request):
    #add new smartplugs here
    entity_ids = [
        "sonoff_1001e01d7b_power",
        "sonoff_1002163433_power"
    ]  
    device_param = request.GET.get("device", "all")  # Default: all devices
    timeframe = request.GET.get("start", "-1h")  # Default: last hour
    stop_time = "now()"
    time_interval = 30  # Assuming 30s intervals in InfluxDB
    electricity_rate = 11.7428  # PHP per kWh (Meralco rate for Jan 2025)

    # If a specific device is requested, filter entity_ids
    if device_param != "all" and device_param in entity_ids:
        entity_ids = [device_param]

    # Fetch current data for selected devices
    current_raw_data = {entity: fetch_power_data(entity, timeframe, stop_time) for entity in entity_ids}
    
    # Compute metrics per device
    current_metrics_per_device = {
        entity: calculate_power_metrics([data], time_interval, electricity_rate)
        for entity, data in current_raw_data.items()
    }

    # Compute total (if multiple devices are included)
    if len(entity_ids) > 1:
        total_metrics = calculate_power_metrics(current_raw_data.values(), time_interval, electricity_rate)
    else:
        total_metrics = None  # No total if only one device is selected

    # Prepare cleaned appliance data
    current_appliance_data = [
        {
            "entity_id": entity_id,
            "data": [
                {
                    "time": record["_time"],
                    "power_w": record["_value"],  # Keep _value or rename if needed
                    "measurement": record["_measurement"]
                }
                for record in raw_data
            ]
        }
        for entity_id, raw_data in current_raw_data.items()
    ]

    # Determine previous timeframe
    previous_timeframes = {
        "-1h": ("-2h", "-1h"),
        "-1d": ("-2d", "-1d"),
        "-1w": ("-2w", "-1w")
    }

    # Fetch previous data and calculate comparison metrics
    if timeframe in previous_timeframes:
        prev_start_time, prev_stop_time = previous_timeframes[timeframe]
        previous_raw_data = {entity: fetch_power_data(entity, prev_start_time, prev_stop_time) for entity in entity_ids}

        previous_metrics_per_device = {
            entity: calculate_power_metrics([data], time_interval, electricity_rate)
            for entity, data in previous_raw_data.items()
        }

        # Compute total previous metrics
        if len(entity_ids) > 1:
            total_previous_metrics = calculate_power_metrics(previous_raw_data.values(), time_interval, electricity_rate)
        else:
            total_previous_metrics = None

        # Calculate saved money per device
        saved_money_per_device = {
            entity: previous_metrics_per_device[entity]["cost_estimation"] - current_metrics_per_device[entity]["cost_estimation"]
            for entity in entity_ids
        }

        # Calculate total saved money
        if total_metrics and total_previous_metrics:
            total_saved_money = total_previous_metrics["cost_estimation"] - total_metrics["cost_estimation"]
        else:
            total_saved_money = None
    else:
        previous_metrics_per_device = None
        total_previous_metrics = None
        saved_money_per_device = None
        total_saved_money = None

    # Add saved money info per device
    for entity in current_metrics_per_device:
        current_metrics_per_device[entity]["saved_money"] = saved_money_per_device.get(entity) if saved_money_per_device else None

    if total_metrics:
        total_metrics["saved_money"] = total_saved_money

# Format final response
    response_data = {
        "current": total_metrics if total_metrics else current_metrics_per_device,
        "previous": total_previous_metrics if total_previous_metrics else previous_metrics_per_device,
        "appliances": [
            {
                "entity_id": entity_id,
                "current": current_metrics_per_device.get(entity_id),  # Include current per device
                "previous": previous_metrics_per_device.get(entity_id) if previous_metrics_per_device else None,  # Include previous per device
                "data": [
                    {
                        "time": record["_time"],
                        "power_w": record["_value"],
                        "measurement": record["_measurement"]
                    }
                    for record in raw_data
                ]
            }
            for entity_id, raw_data in current_raw_data.items()
        ]
    }

    return Response(response_data)
