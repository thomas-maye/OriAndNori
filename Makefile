# Makefile for docker-compose
# Or alias for docker-compose commands
# Just type `make <command>` to run the command

down:
	docker-compose down --remove-orphans

up:
	docker-compose up -d

bash:
	docker-compose run --rm node bash
