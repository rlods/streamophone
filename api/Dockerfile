FROM node:8-alpine

COPY src /app/src/
COPY package.json .babelrc /app/

WORKDIR /app

RUN npm install && \
	npm run prod:build

CMD npm run prod:start
