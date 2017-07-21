FROM node:latest
MAINTAINER kamataryo <mugil.cephalus@gmail.com>

ENV DB_HOST 172.17.0.1
ENV DB_PORT 27017
ENV DB_NAME websocket_iot_server

ADD . /src
WORKDIR /src

RUN npm install && npm run build

EXPOSE 3001
ENTRYPOINT ["/src/bin/docker-entrypoint.sh"]
