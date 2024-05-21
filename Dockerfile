FROM node:latest

RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/chromium /usr/bin/google-chrome-stable

WORKDIR /usr/src/app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV DISPLAY=:99

COPY package*.json ./
RUN npm install

COPY . .

CMD ["sh", "-c", "Xvfb :99 -screen 0 1024x768x24 & npm start"]