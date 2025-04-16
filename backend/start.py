import os
import subprocess
import sys

db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')

python_exe = sys.executable  # this uses the current Python interpreter (from venv) instead of the system python

# If DB doesn't exist, run migrations
if not os.path.exists(db_path):
    print("No database found. Running migrations...")
    subprocess.call([python_exe, 'manage.py', 'migrate'])

# This starts the Django server
subprocess.call([python_exe, 'manage.py', 'runserver', '0.0.0.0:8000'])
