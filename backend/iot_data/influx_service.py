from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

INFLUXDB_URL = os.getenv('INFLUXDB_URL')
INFLUXDB_TOKEN = os.getenv('INFLUXDB_TOKEN')
INFLUXDB_ORG = os.getenv('INFLUXDB_ORG')
INFLUXDB_BUCKET = os.getenv('INFLUXDB_BUCKET')

client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)
query_api = client.query_api()

# change when needed, this is for smartplug #2 if null in data equals it to 0
def fetch_power_data(entity_id="sonoff_1001e01d7b_power", start="-1h", stop="now()", window_period="30s"):
    query = f'''
    from(bucket: "{INFLUXDB_BUCKET}")
      |> range(start: {start}, stop: {stop})
      |> filter(fn: (r) => r["_measurement"] == "W")
      |> filter(fn: (r) => r["entity_id"] == "{entity_id}")
      |> filter(fn: (r) => r["_field"] == "value")
      |> filter(fn: (r) => r["domain"] == "sensor")
      |> aggregateWindow(every: {window_period}, fn: mean, createEmpty: true)
      |> fill(value: 0.0)
      |> sort(columns: ["_time"], desc: true)
      |> yield(name: "mean")
    '''
    result = query_api.query(org=INFLUXDB_ORG, query=query)
    return [record.values for table in result for record in table.records]




