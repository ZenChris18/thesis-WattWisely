FROM ghcr.io/home-assistant/home-assistant:stable

# Create config directory
RUN mkdir -p /config

# Copy backup file (must be in same directory as Dockerfile)
COPY homeassistant.tar.gz /tmp/

# Extract backup and clean up
RUN tar -xzvf /tmp/homeassistant.tar.gz -C /config --strip-components=1 \
    && rm /tmp/homeassistant.tar.gz

# Copy backup script
COPY backup_script.sh /backup_script.sh
RUN chmod +x /backup_script.sh

# Set entrypoint
ENTRYPOINT ["/backup_script.sh"]