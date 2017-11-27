FROM node:8-alpine

COPY public /app/public/
COPY src /app/src/
COPY package.json package-lock.json /app/

WORKDIR /app

# Adding Custom Environment Variables using process.env.REACT_APP_*
# https://github.com/facebookincubator/create-react-app/tree/master/packages/react-scripts/template
ARG REACT_APP_STREAMOPHONE_API_URL

RUN npm install && npm run prod:build

CMD npm run prod:start
