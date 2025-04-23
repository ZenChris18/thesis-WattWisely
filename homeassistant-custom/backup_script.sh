#!/bin/sh

# Restore initial backup if config is empty
if [ -z "$(ls -A /config)" ]; then
    echo "First run - restoring initial backup..."
    tar -xzvf /tmp/homeassistant.tar.gz -C /config --strip-components=1
    chown -R root:root /config
fi

sleep 30

# Create timestamped backup (maintain original structure)
echo "Creating fresh backup..."
tar -czvf /backup/latest_backup.tar.gz -C /config .

# Start Home Assistant
exec python -m homeassistant --config /config