#!/usr/bin/env bash

DB_PATH=./db
LOCAL_BIN=./node_modules/.bin


if [[ $DB_PORT == '' ]]; then
  DB_PORT=27017
fi

# generate keys
./bin/keygen.sh -y

if [[ $NODE_ENV == 'development' ]]; then
  # start DB
  [[ -d $DB_PATH ]] && rm -rf $DB_PATH
  mkdir $DB_PATH
  mongod --dbpath="$DB_PATH" --port="$DB_PORT" &
  PS1=$!

  # wait mongo start
  COUNTER=0
  COMMAND="db.version()"
  while [[ ! $(mongo --eval $COMMAND) ]]; do
   if [[ $COUNTER -gt 100 ]]; then
     # kill all related process
     kill -9 $PS1
     echo 'MongoDB not found.'
     exit 1
   fi
   COUNTER=`1 + $COUNTER`
   sleep 0.1
  done

  # migrate
  npm run migrate
fi

# start dev server
$LOCAL_BIN/nodemon --exec "$LOCAL_BIN/babel-node" -- ./src/index.js

if [[ $NODE_ENV == 'development' ]]; then
  # kill all related process
  kill -15 $PS1
fi
