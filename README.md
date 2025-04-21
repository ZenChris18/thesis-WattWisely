# Thesis-wattwisely

## before starting
1. Create a .env file in the backend folder
- INFLUXDB_URL="localhost if hosted on the same machine or the ip address of the influxdb"
- INFLUXDB_TOKEN="Token"
- INFLUXDB_ORG="org name"
- INFLUXDB_BUCKET="bucket name"

2. install the dependencies for django python use venv go to backend folder type this 
    - python -m venv venv
    - source venv/bin/activate (linux/mac)
    - venv\Scripts\activate (windows)
    - pip install -r requirements.txt

3. install dependencies for react.js go to new_frontend
    - npm install (go to new_frontend folder to install the dependencies only on that folder)

4. update sqlite database (if db.sqlite3 is deleted or extracted)

    - python manage.py makemigrations

    - python manage.py migrate

## commands to make frontend and backend start

1. django - python manage.py runserver 0.0.0.0:8000 (go to backend folder)

2. django - python start.py (Fresh database run, deletes existing DB, recreates it, and adds a superuser) 

3. npm run dev -- --host (go to new_frontend folder)

## Docker Commands 

1. docker compose build

2. 

## Other commands

1. python manage.py createsuperuser - then type new info to access django admin if you want a different user



