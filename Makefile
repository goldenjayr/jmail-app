install:
	docker-compose -f docker-compose.builder.yml run --rm install_client
	docker-compose -f docker-compose.builder.yml run --rm install_db-service
	docker-compose -f docker-compose.builder.yml run --rm install_graphql-service
	docker-compose -f docker-compose.builder.yml run --rm install_smtp-service

dev:
	docker-compose up

setup:
	docker volume create nodemodules


