FROM node:20-alpine

COPY src /app/src/
COPY package.json package-lock.json babel.config.json /app/

WORKDIR /app

RUN npm install && npm run prod:build

CMD npm run prod:start
