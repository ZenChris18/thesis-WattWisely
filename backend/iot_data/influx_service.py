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

def fetch_power_data():
    query = '''
    from(bucket: "home_assistant")
      |> range(start: -1h)  // Last hour of data
      |> filter(fn: (r) => r["_measurement"] == "W")
      |> filter(fn: (r) => r["_field"] == "value")
      |> filter(fn: (r) => r["domain"] == "sensor")
      |> filter(fn: (r) => r["entity_id"] == "sonoff_1002163433_power")
      |> aggregateWindow(every: 30s, fn: mean, createEmpty: true)
      |> fill(value: 0.0)
      |> filter(fn: (r) => r["_value"] != 0.0 or exists r["_value"])
      |> rename(columns: {entity_id: "sensor_entity_id"})
      |> set(key: "sensor_entity_id", value: "sonoff_1002163433_power")
      |> yield(name: "mean")
    '''
    result = query_api.query(org=INFLUXDB_ORG, query=query)
    return [record.values for table in result for record in table.records]
