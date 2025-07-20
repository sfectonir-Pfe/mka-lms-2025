# Stage 1: Build
FROM node:21 AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 2: Production
FROM node:21
WORKDIR /app

RUN yarn global add serve

COPY --from=builder /app/build ./build

EXPOSE 4000

CMD ["serve", "-s", "build", "-l", "4000"]
