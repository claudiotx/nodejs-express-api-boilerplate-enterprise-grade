#! /bin/bash
set -e
kubectl create secret tls code-recipes-certificate-2018 --key coderecipes.key --cert coderecipes.crt