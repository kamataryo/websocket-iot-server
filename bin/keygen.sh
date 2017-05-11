#!/usr/bin/env bash

# generate new key pairs for deployment

if [[ $NODE_ENV == 'production' ]]; then
  KEY_DIR=./dist
else
  KEY_DIR=./src
fi


if [[ $1 != '-y' ]]; then

  echo 'Are you sure that this command rests application secret key? [y/N]'
  read RESET
  if [[ $RESET != 'y' ]]; then
    exit 0
  fi

fi


if [[ -f $KEY_DIR/id_ecdsa ]]; then
  rm $KEY_DIR/id_ecdsa
fi

if [[ -f KEY_DIRid_ecdsa.pub ]]; then
  rm $KEY_DIR/id_ecdsa.pub
fi

ssh-keygen -t ecdsa -f $KEY_DIR/id_ecdsa -q -N ''
