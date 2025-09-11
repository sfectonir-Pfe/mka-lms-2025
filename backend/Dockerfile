# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app


COPY package.json yarn.lock ./

RUN yarn 

COPY . .


RUN npx prisma generate



CMD ["node", "dist/src/main.js"]

