# Stage 1: Build
FROM node:21 AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install 

COPY . .

EXPOSE 3000

CMD [ "npm" , "start" ]
