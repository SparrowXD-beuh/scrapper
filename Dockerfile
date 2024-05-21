FROM node:latest

RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/chromium /usr/bin/google-chrome-stable

WORKDIR /usr/src/app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY package*.json ./
RUN npm install

COPY . .
CMD [ "npm", "start" ]
