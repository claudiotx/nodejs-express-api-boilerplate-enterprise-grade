#!/bin/sh
set -e

pm2 start pm2.json && pm2 log optimize-api