FROM node:8-alpine

COPY public /app/public/
COPY src /app/src/
COPY package.json package-lock.json /app/

WORKDIR /app

ARG STREAMOPHONE_API_URL

RUN npm install && npm run prod:build

CMD npm run prod:start
