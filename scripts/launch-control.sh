#!/bin/sh
set -e

npm install --quiet
npm run build
npm start