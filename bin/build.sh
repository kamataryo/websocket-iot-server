#!/usr/bin/env bash

LOCAL_BIN="./node_modules/.bin"

# build server
$LOCAL_BIN/webpack -p
cp ./package.json ./dist/

# install dependencies
pushd ./dist
type yarn >/dev/null 2>&1 && yarn install --prods
type yarn >/dev/null 2>&1 || npm install --production
popd

rm ./dist/package.json

./bin/keygen.sh -y
