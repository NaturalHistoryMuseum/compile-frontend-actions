#! /bin/bash

# first set the parameters up as env vars
# the target parameter is necessary
export INPUT_TARGET=$1
# the destination parameter is optional
if (( $# > 1 ))
    then
        export INPUT_DESTINATION=$2
fi

# run the script
node `dirname "$0"`/../js/index.js
