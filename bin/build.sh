#!/usr/bin/env bash

LOCAL_BIN="./node_modules/.bin"

# build server
$LOCAL_BIN/webpack -p
cp ./package.json ./dist/

# install dependencies
pushd ./dist
npm install --production
popd

rm ./dist/package.json

./bin/keygen.sh -y
