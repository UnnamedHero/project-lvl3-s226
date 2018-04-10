install:
	npm install

lint:
	npm run eslint .

build:
	rm -rf dist
	npm run build

publish: webpack
	surge ./dist --domain eem-hexlet-rssreader.surge.sh	

webpack:
	npm run webpack
	
test:
	npm test

lt:
	make lint
	make test
