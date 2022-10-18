#!/usr/bin/env bash

# cd to script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Build docker image
docker build --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g) -t pepemon-dev - < "${DIR}/Dockerfile"

docker run --rm -it --net=host \
	-v $(pwd):$(pwd) \
	--user $(id -u):$(id -g) \
	--workdir $(pwd) \
	--env-file "${DIR}/../.env" \
	--entrypoint bash \
	pepemon-dev
