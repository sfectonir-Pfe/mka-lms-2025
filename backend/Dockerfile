# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app


COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


COPY . .
RUN yarn build

# Stage 2: Production
FROM node:20
WORKDIR /app


COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production


COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]