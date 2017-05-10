FROM node:latest
MAINTAINER kamataryo <mugil.cephalus@gmail.com>

ADD . /src
WORKDIR /src

RUN npm install
RUN npm run build
RUN npm run migrate
RUN npm start

EXPOSE 3001
ENTRYPOINT ["npm", "start"]
