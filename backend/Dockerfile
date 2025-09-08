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

# FROM node:18

# WORKDIR /app

# # Copy package files
# COPY package*.json ./
# COPY prisma ./prisma/

# # Install dependencies
# RUN npm install

# # Copy source code
# COPY . .

# # Generate Prisma client
# RUN npx prisma generate

# # Build the application
# RUN npm run build

# # Create uploads directory
# RUN mkdir -p uploads

# EXPOSE 8000

# # Use development mode to avoid build issues
# CMD ["npm", "run", "start:dev"]
