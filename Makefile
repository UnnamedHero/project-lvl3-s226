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
	rm -rf ./dist
	npm run webpack -- --mode production

webpack-dev:
	npm run webpack -- --mode development

test:
	npm test

lt:
	make lint
	make test
