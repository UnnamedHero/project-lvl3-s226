install:
	npm install

lint:
	npm run eslint .

build:
	rm -rf dist
	npm run build

webpack:
	npm run webpack
	
test:
	npm test