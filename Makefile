up:
	docker-compose up -d 
exec:
	docker-compose exec frourio ash
frourio:
	@make exec
stop:
	docker-compose stop
down:
	docker-compose down --remove-orphans
restart:
	@make down
	@make up
destroy:
	@make down

dev:
	@make up && yarn --cwd ./app dev

product-up:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d