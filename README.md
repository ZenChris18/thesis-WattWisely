# Thesis-wattwisely

## before starting
1. make env file

2. install dependencies for django python use venv go to backend folder type this 
    - python -m venv venv
    - source venv/bin/activate (linux/mac)
    - venv\Scripts\activate (windows)
    - pip install -r requirements.txt

3. install dependencies for react.js go to new_frontend
    - npm install

## commands to make frontend and backend run

1. django - python manage.py runserver 0.0.0.0:8000 (go to backend folder)

2. npm run dev -- --host (go to new_frontend folder)

## update sqlite database 

1. python manage.py makemigrations

2. python manage.py migrate

