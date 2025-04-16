import os
import subprocess
import sys
import django
from django.core.management import call_command
from django.contrib.auth import get_user_model

base_dir = os.path.dirname(__file__)
db_path = os.path.join(base_dir, 'db.sqlite3')
python_exe = sys.executable  # Uses current Python interpreter (should be venv) instead of the system python

# Delete db.sqlite3 if it exists in order to start fresh
if os.path.exists(db_path):
    print("Deleting existing database...")
    os.remove(db_path)

# Run migrations to create a fresh database
print("Running migrations...")
subprocess.call([python_exe, 'manage.py', 'migrate'])

# Setup Django before using ORM
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wattwisely.settings')
django.setup()

# Create a default superuser
User = get_user_model()
USERNAME = 'zenchris'
EMAIL = '' # no email needed
PASSWORD = '12345' # to keep it simple

if not User.objects.filter(username=USERNAME).exists():
    print("Creating superuser...")
    User.objects.create_superuser(USERNAME, EMAIL, PASSWORD)
else:
    print("Superuser already exists.")

# Start the server
print("Starting development server at 0.0.0.0:8000")
subprocess.call([python_exe, 'manage.py', 'runserver', '0.0.0.0:8000'])
