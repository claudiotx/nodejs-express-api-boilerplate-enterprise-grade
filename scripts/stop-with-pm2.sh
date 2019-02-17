#!/bin/sh
set -e

pm2 stop optimize-api
pm2 delete optimize-api