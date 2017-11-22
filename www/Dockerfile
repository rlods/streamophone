FROM node:8-alpine

COPY public /app/public/
COPY src /app/src/
COPY package.json /app/

WORKDIR /app

RUN npm install && \
	npm run prod:build

CMD npm run prod:start
