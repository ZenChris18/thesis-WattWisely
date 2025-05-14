# Steps to install

## download docker 
### windows 
- download docker desktop

### linux distro
- sudo apt update
- curl -fsSL https://get.docker.com | sudo sh
- sudo apt-get update && sudo apt-get install docker-compose-plugin

#### Check if installed
- docker compose version
- docker-compose build --no-cache frontend
- docker-compose up -d --force-recreate frontend