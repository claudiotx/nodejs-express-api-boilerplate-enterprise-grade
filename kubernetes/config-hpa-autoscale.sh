#!/bin/bash
set -e
kubectl autoscale deployment nodejs-api-deployment --min=1 --max=5 --cpu-percent=50