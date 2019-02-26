#! /bin/bash
set -e
kubectl create secret docker-registry regcred --docker-server=https://index.docker.io/v1/ --docker-username=coderecipes --docker-email=contact@claudioteixeira.com --docker-password=mypass