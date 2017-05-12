FROM node:latest
MAINTAINER kamataryo <mugil.cephalus@gmail.com>

ENV DB_HOST localhost
ENV DB_PORT 27017
ENV DB_NAME websocket_iot_server

ADD . /src
WORKDIR /src

RUN npm install
RUN npm run build
RUN npm run migrate

EXPOSE 3001
ENTRYPOINT ["node", "/src/dist/bundle.js"]
