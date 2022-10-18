#!/bin/bash
DEFAULT_TAG='dev'

function help {
  echo "Usage: " 
  echo "h - This help"
  echo "n - Dockerhub username"
  echo "t - Tag to apply on docker image"
}

while getopts "h:n:t:" arg; do
  case $arg in
    h)
      help
      exit 0
      ;;
    n)
      USER_NAME=$OPTARG
      ;;
    t)
      TAG_NAME="${OPTARG:-$DEFAULT_TAG}"
      ;;
  esac
done

if [ -z "$USER_NAME" ]; then
  echo "User name can not be empty"
  help
  exit 1
fi

echo "🔨 Building echo-relay for user: $USER_NAME, tag: $TAG_NAME"
echo
docker build ./ -t $USER_NAME/echo-relay:$TAG_NAME

echo "🔐 Dockerhub login for user: $USER_NAME"
docker login -u "$USER_NAME" docker.io
docker push $USER_NAME/echo-relay:$TAG_NAME

