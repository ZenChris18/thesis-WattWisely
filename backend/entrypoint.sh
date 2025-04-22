#!/bin/sh
set -ex

if [ ! -f /app/db.sqlite3 ]; then
  echo "Initializing database..."
  python manage.py migrate --noinput

  # Fix permissions for the database
  touch /app/db.sqlite3
  chmod 666 /app/db.sqlite3

  echo "Creating superuser..."
  python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="zenchris").exists():
    User.objects.create_superuser("zenchris", "", "12345")
EOF
fi

exec "$@"