#!/bin/sh
set -e

# Build and tag image
docker-compose build --pull

# Log in to Docker Hub and push
echo "${DOCKER_PASSWORD}" | docker login --username "${DOCKER_USERNAME}" --password-stdin

docker-compose push
