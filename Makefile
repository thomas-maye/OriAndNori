# Makefile for docker-compose
# Or alias for docker-compose commands
# Just type `make <command>` to run the command

down:
	docker-compose down --remove-orphans

up:
	docker-compose up -d

bash:
	docker-compose run --rm node bash

pull:
	docker-compose pull

build:
	docker-compose build

copy-docker-compose-dev:
	cp docker-compose.dev.yml docker-compose.yml

copy-docker-compose-prod:
	cp docker-compose.prod.yml docker-compose.yml

node-install-dev:
	docker-compose run --rm node npm install

node-update-dev:
	docker-compose run --rm node npm update

node-install-prod:
	docker-compose run --rm node npm install --production

node-update-prod:
	docker-compose run --rm node npm update --production

restart: down up

upgrade-dev: copy-docker-compose-dev pull build up node-install-dev

upgrade-prod: copy-docker-compose-prod pull build up node-install-prod
