# all: ...

install:
	cd api; npm install; cd ../www; npm install

dev-cache:
	docker-compose up cache

dev-api:
	source .env-test; cd api; npm run dev

dev-www:
	source .env-test; cd www; npm run dev

prod-build:
	docker-compose build

prod-up:
	docker-compose up
