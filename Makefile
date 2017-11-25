# all: ...

install:
	cd api; npm install; cd ../www; npm install

dev-api:
	source .env-test; cd api; npm run dev

dev-www:
	source .env-test; cd www; npm run dev
