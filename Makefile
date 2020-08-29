#!/usr/bin/make

SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

ifneq ($(OS),Windows_NT)
POSIXSHELL := 1
else
POSIXSHELL :=
endif

# to see all colors, run
# bash -c 'for c in {0..255}; do tput setaf $c; tput setaf $c | cat -v; echo =$c; done'
# the first 15 entries are the 8-bit colors

# define standard colors
BLACK        := $(shell tput -Txterm setaf 0)
RED          := $(shell tput -Txterm setaf 1)
GREEN        := $(shell tput -Txterm setaf 2)
YELLOW       := $(shell tput -Txterm setaf 3)
LIGHTPURPLE  := $(shell tput -Txterm setaf 4)
PURPLE       := $(shell tput -Txterm setaf 5)
BLUE         := $(shell tput -Txterm setaf 6)
WHITE        := $(shell tput -Txterm setaf 7)

RESET := $(shell tput -Txterm sgr0)

# default "prompt"
P = ${GREEN}[+]${RESET}

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: help

##############################################################################
# Docker Development
##############################################################################

setup: | init build db-up up ## Setup the environment, build the containers and run the solution.

docker: | build up ## Starts existing containers for local development

restart: | stop build up ## Recreates local docker environment

init: ## Initializes the environment
	@echo "$(P) Initializing environment..."
	@bash "./scripts/gen-env-files.sh"
	@cd frontend; npm install;

up: ## Runs the local development containers.  You can specify which container 'n={container name}'
	@echo "$(P) Running client and server..."
	@docker-compose up -d $(n)

stop: ## Closes the local development named container 'n={container name}'
	@echo "$(P) Stopping client and server..."
	@docker-compose stop $(n)

down: ## Closes the local development containers
	@echo "$(P) Stopping client and server..."
	@docker-compose down

build: ## Builds the local development containers
	@echo "$(P) Building images..."
	@docker-compose build --no-cache $(n)

clean: ## Removes local containers, images, volumes, etc
	@echo "$(P) Removing containers, images, volumes etc..."
	@echo "$(P) Note: does not clear image cache."
	@docker-compose stop
	@docker-compose rm -f -v -s
	@docker volume rm -f pims-app-node-cache pims-api-db

clean-npm: ## Removes the pims-app container and node modules and installs modules
	@echo "$(P) Removing pims-app container and node modules"
	@docker-compose stop pims-app
	@docker container rm -f pims-app
	@docker volume rm -f pims-app-node-cache
	@cd frontend; npm install --no-save;

clean-db: ## Re-creates an empty docker database - ready for seeding
	@echo "$(P) Refreshing the database..."
	@docker-compose up -d pims-database
	@cd api/libs/Data; dotnet ef database drop --force; dotnet ef database update

db-up: ## Start the database container
	@echo "$(P) Starting database container..."
	@docker-compose up -d pims-database
	@-sleep 30
	@cd api/libs/Data; dotnet ef database update;

db-migration: ## Create a new migration with the specified name 'n={migration name}'
	@echo "$(P) Creating a new migration '$(n)'"
	@cd api/libs/Data; dotnet ef migrations add $(n);

db-refresh: | clean-db ## Clean the database and refresh the migration and data

pause-30:
	@echo "$(P) Pausing 30 seconds..."
	@-sleep 30

app-test: ## Runs the react app tests in a container
	@echo "$(P) Running client unit tests..."
	@docker-compose run pims-app npm test

api-test: ## Runs the api unit tests
	@echo "$(P) Running api unit tests..."
	@cd api; dotnet test;

.PHONY: local setup init build up restart stop down clean clean-npm clean-db app-test api-test pause-30 db-up db-refresh db-migration
