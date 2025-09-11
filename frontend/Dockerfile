
FROM node:21 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
COPY . .


CMD [ "npm" , "start" ]


