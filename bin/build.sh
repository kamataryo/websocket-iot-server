#!/usr/bin/env bash

LOCAL_BIN="./node_modules/.bin"

# build server
NODE_ENV=production $LOCAL_BIN/webpack -p
cp ./package.json ./dist/

pushd
./dist && npm install --production
popd

rm ./dist/package.json
