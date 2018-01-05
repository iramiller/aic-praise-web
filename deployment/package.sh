#!/bin/bash

# This script packages and publishes the containers.  Local docker instance must be logged in with a
# user that has publish permissions to the docker registry in order for script to complete successfully.

# Build Docker images bundling jar, config and model from PRAiSE:
# worldmodelers.cse.sri.com/praise-web-worker:vNN

if [ "$1" = "" ]; then
  echo ""
  echo "Usage: $0 VERSION {JARPATH} CONFIG"
  echo ""
  echo "Example: $0 v7 /absolute/path/to/praise.jar configfile.json"
  echo ""
  echo "Creates and publishes server, worker images named praise-web-server:vNN and praise-web-worker:vNN"
  exit 1
fi

WB_VERSION=$1
WB_PRAISE_JAR=$2
WB_CFG_FILE=$3

BASE_STRING=worldmodelers.cse.sri.com/praise-web

if [ ! -f "$WB_PRAISE_JAR" ]; then
  echo "Can't find jar file: $WB_PRAISE_JAR"
  exit 1
fi

if [ ! -f "$WB_CFG_FILE" ]; then
  echo "Can't find configuration file: $WB_CFG_FILE"
  exit 1
fi


# CREATE THE SERVER CONTAINER IMAGE
SERVER_IMAGE=${BASE_STRING}-server:${WB_VERSION}
# Copy files and setup here.
# build it.
docker built -t $SERVER_IMAGE ./server
echo ""
echo "=================================================================="
echo "Created: $SERVER_IMAGE"
echo "=================================================================="

# CREATE THE WORKER CONTAINER IMAGE
WORKER_IMAGE=${BASE_STRING}-worker:${WB_VERSION}
# place jar file in expected location.  Remove any previous versions of the jar.
rm ./worker/praise.jar
cp $WB_PRAISE_JAR ./worker/praise.jar
# build it
docker build -t WORKER_IMAGE ./worker
echo ""
echo "=================================================================="
echo "Created: $WORKER_IMAGE"
echo "=================================================================="


# Publish images.  Will fail if local docker instance is not authenticated
docker push $SERVER_IMAGE
echo ""
echo "=================================================================="
echo "Published: $SERVER_IMAGE"
echo "=================================================================="

docker push $WORKER_IMAGE
echo ""
echo "=================================================================="
echo "Published: $WORKER_IMAGE"
echo "=================================================================="

echo "Complete."
