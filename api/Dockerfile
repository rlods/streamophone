FROM oven/bun:1-alpine

COPY src /app/src/
COPY package.json tsconfig.json /app/

WORKDIR /app

RUN bun install --frozen-lockfile || bun install

CMD ["bun", "run", "start"]
