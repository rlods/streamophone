FROM oven/bun:1-alpine AS builder

COPY public /app/public/
COPY src /app/src/
COPY package.json tsconfig.json /app/

WORKDIR /app

ARG STREAMOPHONE_API_URL

RUN bun install --frozen-lockfile || bun install
RUN bun run build

FROM oven/bun:1-alpine

COPY --from=builder /app/build /app/build
COPY --from=builder /app/node_modules /app/node_modules
COPY package.json /app/

WORKDIR /app

CMD ["bun", "run", "start"]
