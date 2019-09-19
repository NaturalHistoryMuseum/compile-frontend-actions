#! /bin/bash

# first set the parameters up as env vars
# the target parameter is necessary
export INPUT_TOKEN=$1
export INPUT_MESSAGE=$2
export INPUT_MODIFIED=$3

# run the script
node `dirname "$0"`/../commit/index.js
