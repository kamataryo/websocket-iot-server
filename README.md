# WebSocket IoT Server

[![Build Status](https://travis-ci.org/kamataryo/websocket-iot-server.svg?branch=master)](https://travis-ci.org/kamataryo/websocket-iot-server)

This is an Raspberry Pi WebSocket IoT server.

## Implicit dependency

- mongoDB
- ssh-keygen

## usage

```
git clone -b _server_release https://github.com/kamataryo/websocket-iot-server.git
forever start 'node ./websocket-iot-server/index.js'
```

## development

```
$ git clone https://github.com/kamataryo/websocket-iot-server.git
$ cd websocket-iot-server
$ npm install
$ npm start
```

Websocket server listen at port 3001.
MongoDB will listen at port 27017.
