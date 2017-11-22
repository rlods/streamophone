# all: ...

install:
	cd api; npm install; cd ../www; npm install

dev-api:
	cd api; npm run dev

prod-api:
	cd api; npm run prod:build

dev-www:
	cd www; npm run dev

prod-www:
	cd www; npm run prod:build
