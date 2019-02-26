#! /bin/bash
set -e
kubectl create configmap production-config --from-env-file=api-production-env.properties
kubectl create configmap staging-config --from-env-file=api-staging-env.properties
kubectl create configmap development-config --from-env-file=api-development-env.properties