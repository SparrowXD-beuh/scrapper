FROM ghcr.io/puppeteer/puppeteer:latest

RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

COPY package*.json ./
RUN npm install

COPY . .
CMD [ "npm", "start" ]