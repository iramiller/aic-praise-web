#!/bin/bash

# This script packages and publishes the containers.  Local docker instance must be logged in with a
# user that has publish permissions to the docker registry in order for script to complete successfully.

# Build Docker images bundling jar, config and model from PRAiSE:
# worldmodelers.cse.sri.com/praise-web-worker:vNN

if [ "$1" = "" ]; then
  echo ""
  echo "Usage: $0 VERSION {JARPATH}"
  echo ""
  echo "Example: $0 v7 /absolute/path/to/praise.jar"
  echo ""
  echo "Creates and publishes server image named praise-web-server:vNN"
  echo ""
  exit 1
fi

WM_VERSION=$1
WM_PRAISE_JAR=$2

BASE_STRING=worldmodelers.cse.sri.com/praise-web

if [ ! -f "$WM_PRAISE_JAR" ]; then
  echo "Can't find jar file: $WM_PRAISE_JAR"
  exit 1
fi

# CREATE THE SERVER CONTAINER IMAGE
SERVER_IMAGE=${BASE_STRING}-server:${WM_VERSION}
echo ""
echo "=================================================================="
echo "Building server image: $SERVER_IMAGE"
echo "=================================================================="
echo "Cleaning content target"
# make sure there are not leftover artifacts first.
rm -rf ./server/content ./server/contents.tgz;
# create folder for content root and copy application files into it.
mkdir -p ./server/content
echo "Copying files into archive"
cp -R ../server/public ../server/bin ../server/routes ../server/views ../server/*.js* ./server/content
cp "$WM_PRAISE_JAR" ./server/content/praise.jar
pushd ./server/content
tar czvf ../contents.tgz .
popd
rm -rf ./server/content/

echo "Assembling container image"

# build it.
pushd ./server
docker build -t "$SERVER_IMAGE" .
popd
echo ""
echo "=================================================================="
echo "Created: $SERVER_IMAGE"
echo "=================================================================="

# Publish images.  Will fail if local docker instance is not authenticated
docker push $SERVER_IMAGE
echo ""
echo "=================================================================="
echo "Published: $SERVER_IMAGE"
echo "=================================================================="

echo "Complete."
