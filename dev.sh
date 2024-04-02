#!/usr/bin/env bash

docker-compose up -d pg
pgport=$(docker-compose port pg 5432 | cut -d: -f2)
>&2 echo "PostgreSQL running on port: $pgport"
echo "export PGPORT=$pgport"
echo "export DATABASE_URL=postgres://postgres:postgres@localhost:$pgport/postgres"
