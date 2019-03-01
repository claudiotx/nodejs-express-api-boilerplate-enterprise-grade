#!/bin/sh
while true; do date && curl -m 5 http://localhost:7777/health && echo; sleep 1; done
