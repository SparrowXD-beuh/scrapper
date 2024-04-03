FROM node:latest

RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY package*.json ./
RUN npm install

COPY . .
CMD [ "npm", "start" ]
