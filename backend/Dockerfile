# Étape 1 : Build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : Runtime
FROM node:18
WORKDIR /app
COPY --from=builder /app .
RUN npm install --omit=dev
CMD ["node", "dist/main"]
