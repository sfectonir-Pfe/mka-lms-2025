# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app


COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile
RUN yarn 

COPY . .

RUN npx prisma generate

RUN yarn build

# Stage 2: Production
# FROM node:20
# WORKDIR /app


# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile --production

EXPOSE 8000
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

CMD ["node", "dist/src/main.js"]