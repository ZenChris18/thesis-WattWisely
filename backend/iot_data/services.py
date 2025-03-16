def calculate_power_metrics(appliance_data, time_interval=30, electricity_rate=11.7428):
    """
    Calculate power metrics including peak power that only considers active devices correctly.
    
    Parameters:
        appliance_data (list): List of power readings from InfluxDB.
        time_interval (int): The time interval between readings in seconds (default: 30s).
        electricity_rate (float): Cost per kWh (default: 11.7428 PHP/kWh).

    Returns:
        dict: Contains total power (W), energy consumption (kWh), cost, peak power (W), and average power (W).
    """
    total_power = 0
    total_energy_wh = 0  # Total energy in Wh
    power_values = []
    timestamp_power_map = {}  # Stores total power per timestamp

    for data in appliance_data:
        for record in data:
            if "_value" in record:
                power = record["_value"]
                total_power += power
                total_energy_wh += (power * time_interval / 3600)  # Convert W to Wh
                power_values.append(power)

                # Aggregate power at each timestamp
                timestamp = record["_time"]
                if timestamp in timestamp_power_map:
                    timestamp_power_map[timestamp].append(power)
                else:
                    timestamp_power_map[timestamp] = [power]

    total_energy_kwh = total_energy_wh / 1000  # Convert Wh to kWh
    cost_estimation = total_energy_kwh * electricity_rate  # Cost in PHP

    # Determine overall peak power properly
    peak_power = 0
    for power_list in timestamp_power_map.values():
        combined_power = sum(power_list)  # Sum only the active ones
        peak_power = max(peak_power, combined_power)

    avg_power = (sum(power_values) / len(power_values)) if power_values else 0  # Average power

    return {
        "average_power_w": round(avg_power, 2),
        "energy_kwh": round(total_energy_kwh, 4),  
        "cost_estimation": round(cost_estimation, 2),  
        "peak_power_w": peak_power,  # 🔥 Now correctly considers only active devices
    }
