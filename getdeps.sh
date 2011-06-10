#!/bin/bash
cd "$(dirname $0)"
force=$1

download() {
  if [ $force == "-f" ] || [[ ! -e $2 ]]; then
    echo "Downloading <$1> to: $2"
    curl -# $1 -o $2
  fi
}

download http://code.jquery.com/jquery-1.6.1.min.js public/javascripts/jquery.min.js
download http://documentcloud.github.com/underscore/underscore-min.js public/javascripts/underscore-min.js

