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