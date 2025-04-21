FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Serve with a simple web server (you can use nginx if needed)
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "0.0.0.0:3000"]

