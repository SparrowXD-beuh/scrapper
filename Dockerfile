FROM node:19.5.0

ENV CHROMIUM_VERSION=901912
ENV CHROMIUM_DIR=/usr/src/chromium

RUN apt-get update && \
    apt-get install -y wget

RUN wget -q -O chromium.tar.gz https://github.com/alixaxel/chrome-aws-lambda/releases/download/v${CHROMIUM_VERSION}/chromium-aws-lambda-linux.zip && \
    mkdir -p ${CHROMIUM_DIR} && \
    tar -xzf chromium.tar.gz -C ${CHROMIUM_DIR} && \
    rm chromium.tar.gz

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

CMD [ "npm", "test" ]