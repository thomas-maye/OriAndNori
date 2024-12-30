down:
	docker-compose down --remove-orphans

up:
	docker-compose up -d

bash:
	docker-compose run --rm node bash
