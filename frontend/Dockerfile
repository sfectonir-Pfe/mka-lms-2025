# Stage 1: Build React app
FROM node:21 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
# RUN yarn build  # ينتج static files في /app/build

# Stage 2: Serve static files on port 3000 (inside container)
# FROM node:21-slim

# WORKDIR /app
# RUN yarn global add serve
# COPY --from=builder /app/build ./build

# EXPOSE 3000
CMD ["yarn","start"]
