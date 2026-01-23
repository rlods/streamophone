# Streamophone Makefile
# Supports both bun and npm (bun preferred)

RUNTIME := $(shell command -v bun 2> /dev/null && echo "bun" || echo "npm")

install:
	cd api && $(RUNTIME) install
	cd streamer && $(RUNTIME) install
	cd www && $(RUNTIME) install

dev-cache:
	docker-compose up cache

dev-api:
	source .env-test && cd api && $(RUNTIME) run dev

dev-streamer:
	source .env-test && cd streamer && $(RUNTIME) run dev

dev-www:
	source .env-test && cd www && $(RUNTIME) run dev

prod-build:
	docker-compose build

prod-up:
	docker-compose up

# Explicit bun commands
bun-install:
	cd api && bun install
	cd streamer && bun install
	cd www && bun install

bun-dev-api:
	source .env-test && cd api && bun run dev

bun-dev-streamer:
	source .env-test && cd streamer && bun run dev

bun-dev-www:
	source .env-test && cd www && bun run dev

# Clean
clean:
	rm -rf api/node_modules streamer/node_modules www/node_modules
	rm -rf www/build
