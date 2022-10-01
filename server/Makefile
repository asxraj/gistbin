include .envrc

# ==================================================================================== #
# DEVELOPMENT
# ==================================================================================== #

## run/api: run the cmd/api application
.PHONY: run/api
run/api:
	go run ./cmd/api -dsn=${GISTBIN_DB_DSN} -jwt-secret=${GISTBIN_JWT_SECRET}

## test: run the cmd/api application
.PHONY: test
test:
	go test -v ./cmd/api -dsn=${GISTBIN_DB_DSN} -jwt-secret=${GISTBIN_JWT_SECRET}

## db/psql: connect to the database using psql
.PHONY: db/psql
db/psql:
	psql ${GISTBIN_DB_DSN}

## db/migrations/new name=$1: create a new database migration
.PHONY: db/migrations/new
db/migrations/new:
	@echo 'Creating migration files for ${name}...'
	migrate create -seq -ext=.sql -dir=./migrations ${name}

## db/migrations/up: apply all up database migrations
.PHONY: db/migrations/up
db/migrations/up: 
	@echo 'Running up migrations...'
	migrate -path ./migrations -database ${GISTBIN_DB_DSN} up

## db/migrations/down: apply all down database migrations
.PHONY: db/migrations/down
db/migrations/down: 
	@echo 'Running down migrations...'
	migrate -path ./migrations -database ${GISTBIN_DB_DSN} down
