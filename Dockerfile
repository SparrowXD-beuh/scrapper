FROM node:19.5.0

WORKDIR /usr/src/app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY package*.json ./
RUN npm install

COPY . .
CMD [ "npm", "test" ]