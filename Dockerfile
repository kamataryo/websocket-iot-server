FROM node:latest
MAINTAINER kamataryo <mugil.cephalus@gmail.com>

ADD . /src
WORKDIR /src

RUN npm install
RUN NODE_ENV＝production npm run build
RUN npm run migrate

EXPOSE 3001
ENTRYPOINT ["NODE_ENV＝production", "npm", "start"]
