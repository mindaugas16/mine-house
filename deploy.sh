#!/bin/zsh

docker-compose up -d && pm2 start pm2-processes.json --env production

