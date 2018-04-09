install:
	npm install

lint:
	npm run eslint .

build:
	rm -rf dist
	npm run build

test:
	npm test