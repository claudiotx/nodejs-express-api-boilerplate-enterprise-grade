#!/bin/sh
set -e

docker build -t enterprise-api .
docker run -d -p 7777:7777 --name=enterprise-api enterprise-api
