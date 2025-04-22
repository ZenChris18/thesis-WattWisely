FROM ghcr.io/home-assistant/home-assistant:stable

RUN mkdir -p /config
COPY homeassistant_backup.tar /tmp/
RUN tar -xf /tmp/homeassistant_backup.tar -C /config \
    && rm /tmp/homeassistant_backup.tar

