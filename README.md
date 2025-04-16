# Thesis-wattwisely

## before starting
1. make env file in backend folder
- INFLUXDB_URL="localhost if hosted on the same machine or the ip address of the influxdb"
- INFLUXDB_TOKEN="Token"
- INFLUXDB_ORG="org name"
- INFLUXDB_BUCKET="bucket name"

2. install dependencies for django python use venv go to backend folder type this 
    - python -m venv venv
    - source venv/bin/activate (linux/mac)
    - venv\Scripts\activate (windows)
    - pip install -r requirements.txt

3. install dependencies for react.js go to new_frontend
    - npm install

4. update sqlite database (if db.sqlite3 is deleted or extracted)

    - python manage.py makemigrations

    - python manage.py migrate

## commands to make frontend and backend start

1. django - python manage.py runserver 0.0.0.0:8000 (go to backend folder)
                or 
          - python python start.py (this will run the migrations if it doesnt exist and also make the server start)

2. npm run dev -- --host (go to new_frontend folder)



