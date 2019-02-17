#!/bin/sh
set -e
docker rm enterprise-api
docker run -d -p 7777:7777 --name=enterprise-api claudiotx/enterprise-api:production-6599bc38fd3e8fd76aa5f0297a4acc7ac9472ceb
