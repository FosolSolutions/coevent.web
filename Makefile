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

restart: | stop build up ## Restart local docker environment

refresh: | down build up ## Recreates local docker environment

start up: ## Runs the local containers (n=service name)
	@echo "$(P) Running client and server..."
	@docker-compose up -d $(n)

destroy: ## Stops the local containers and removes them (n=service name)
	@echo "$(P) Removing docker containers..."
	@docker-compose rm -s -f $(n)

down: ## Stops the local containers and removes them
	@echo "$(P) Stopping client and server..."
	@docker-compose down

stop: ## Stops the local containers (n=service name)
	@echo "$(P) Stopping client and server..."
	@docker-compose stop $(n)

build: ## Builds the local containers (n=service name)
	@echo "$(P) Building images..."
	@docker-compose build --no-cache $(n)

rebuild: ## Build the local contains (n=service name) and then start them after building
	@make build n=$(n)
	@make up n=$(n)

clean: ## Removes all local containers, images, volumes, etc
	@echo "$(P) Removing all containers, images, volumes for solution."
	@docker-compose rm -f -v -s
	@docker volume rm -f ce-app-node-cache
	@docker volume rm -f ce-api-db-data

logs: ## Shows logs for running containers (n=service name)
	@docker-compose logs -f $(n)

setup: ## Setup local container environment, initialize keycloak and database
	@make build; make up; make pause-30; make db-update; make db-seed; make keycloak-sync;

pause-30:
	@echo "$(P) Pausing 30 seconds..."
	@-sleep 30

client-test: ## Runs the client tests in a container
	@echo "$(P) Running client unit tests..."
	@docker-compose run app npm test

server-test: ## Runs the server tests in a container
	@echo "$(P) Running server unit tests..."
	@docker-compose run api dotnet test

server-run: ## Starts local server containers
	@echo "$(P) Starting server containers..."
	@docker-compose up -d keycloak api

npm-clean: ## Removes local containers, images, volumes, for app application.
	@echo "$(P) Removing app containers and volumes."
	@docker-compose stop app
	@docker-compose rm -f -v -s app
	@docker volume rm -f ce-app-node-cache

npm-refresh: ## Cleans and rebuilds the app.  This is useful when npm packages are changed.
	@make npm-clean; make build n=app; make up;

db-migrations: ## Display a list of migrations.
	@echo "$(P) Display a list of migrations."
	@cd api/libs/Data; dotnet ef migrations list

db-add: ## Add a new database migration for the specified name (n=name of migration).
	@echo "$(P) Create a new database migration for the specified name."
	@cd api/libs/Data; dotnet ef migrations add $(n); code -r ./Migrations/*_$(n).cs
	@./scripts/db-migration.sh $(n);

db-update: ## Update the database with the latest migration.
	@echo "$(P) Updating database with latest migration..."
	@docker-compose up -d database; cd api/libs/Data; dotnet ef database update

db-rollback: ## Rollback to the specified database migration (n=name of migration).
	@echo "$(P) Rollback to the specified database migration."
	@cd api/libs/Data; dotnet ef database update $(n);

db-remove: ## Remove the last database migration.
	@echo "$(P) Remove the last migration."
	@cd api/libs/Data; dotnet ef migrations remove --force;

db-clean: ## Re-creates an empty docker database - ready for seeding.
	@echo "$(P) Refreshing the database..."
	@cd api/libs/Data; dotnet ef database drop --force; dotnet ef database update

db-drop: ## Drop the database.
	@echo "$(P) Drop the database."
	@cd api/libs/Data; dotnet ef database drop;

db-script: ## Export an SQL script from the migration (from=0 to=Initial).
	@echo "$(P) Exporting script to 'db-migration.sql'"
	@cd api/libs/Data; dotnet ef migrations script ${from} ${to} --output ../../db-migration.sql

keycloak-sync: ## Syncs accounts with Keycloak and CoEvent
	@echo "$(P) Syncing keycloak with CoEvent..."
	@cd tools/keycloak/sync; dotnet build; dotnet run;

convert: ## Convert Excel files to JSON
	@echo "$(P) Convert Excel files to JSON..."
	@cd tools/converters/excel; dotnet build; dotnet run;

api-test: ## Run api unit tests
	@echo "$(P) Run api unit tests"
	@cd api; dotnet test;

app-test: ## Run app unit tests
	@echo "$(P) Run app unit tests"
	@cd app; npm run test:watch;

api-coverage: ## Generate coverage report for api
	@echo "$(P) Generate coverage report for api"
	@cd api/tests/unit/api; dotnet build;
	@cd api/tests/unit/dal; dotnet build;
	@cd api; coverlet ./tests/unit/api/bin/Debug/net5.0/CoEvent.Api.Test.dll --target "dotnet" --targetargs "test ./ --no-build" -o "./tests/TestResults/coverage.json" --exclude "[*.Test]*" --exclude "[*]*Model" --exclude-by-attribute "CompilerGenerated" -f json
	@cd api; coverlet ./tests/unit/dal/bin/Debug/net5.0/CoEvent.Dal.Test.dll --target "dotnet" --targetargs "test ./ --no-build" -o "./tests/TestResults/coverage.xml" --exclude "[*.Test]*" --exclude "[*]*Model" --exclude-by-attribute "CompilerGenerated" --merge-with "tests/TestResults/coverage.json" -f cobertura
	@cd api; reportgenerator "-reports:./tests/TestResults/coverage.xml" "-targetdir:./tests/TestResults/Coverage" -reporttypes:Html
	@cd api; start ./tests/TestResults/Coverage/index.htm

app-coverage: ## Generate coverage report for app
	@echo "$(P) Generate coverage report for app"
	@cd app; npm run coverage;

.PHONY: logs start destroy local setup restart refresh up down stop build rebuild clean client-test server-test pause-30 server-run db-migrations db-add db-update db-rollback db-remove db-clean db-drop db-seed db-refresh db-script npm-clean npm-refresh keycloak-sync convert api-coverage app-coverage api-test app-test

