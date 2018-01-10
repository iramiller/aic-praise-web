#!/bin/bash

# Trigger an error if non-zero exit code is encountered
set -e

if [ "${1}" == "praise-server" ]; then
	shift
	exec npm start
else
	exec ${@}
fi
