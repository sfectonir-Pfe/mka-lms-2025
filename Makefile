# ===========================
# Variables
# ===========================
FRONT_COMPOSE=./frontend/docker-compose.yml
BACK_COMPOSE=./backend/docker-compose.yml
JITSI_COMPOSE=./lms-jitsi/docker-compose.yml
JITSI_JIBRI=./lms-jitsi/jibri.yml
SERVICE=backend

GREEN=\033[0;32m
NC=\033[0m # No Color

# ===========================
# Global Commands (Frontend + Backend + Jitsi)
# ===========================
.PHONY: up down restart logs build-all

up:
	@echo "$(GREEN)Starting frontend, backend and Jitsi...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) up -d
	docker-compose -f $(BACK_COMPOSE) up -d
	docker-compose -f $(JITSI_COMPOSE) -f $(JITSI_JIBRI) up -d

down:
	@echo "$(GREEN)Stopping frontend, backend and Jitsi...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) down
	docker-compose -f $(BACK_COMPOSE) down
	docker-compose -f $(JITSI_COMPOSE) -f $(JITSI_JIBRI) down

restart:
	@echo "$(GREEN)Restarting all services...$(NC)"
	make down
	make up

logs:
	@echo "$(GREEN)Showing logs for all services...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) logs -f &
	docker-compose -f $(BACK_COMPOSE) logs -f &
	docker-compose -f $(JITSI_COMPOSE) -f $(JITSI_JIBRI) logs -f

build-all:
	@echo "$(GREEN)Building all Docker images (no cache)...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) build --no-cache
	docker-compose -f $(BACK_COMPOSE) build --no-cache
	docker-compose -f $(JITSI_COMPOSE) -f $(JITSI_JIBRI) build --no-cache

# ===========================
# Frontend Commands
# ===========================
.PHONY: front-up front-down front-build front-logs

front-up:
	@echo "$(GREEN)Starting frontend...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) up -d

front-down:
	@echo "$(GREEN)Stopping frontend...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) down

front-build:
	@echo "$(GREEN)Building frontend Docker image (no cache)...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) build

front-logs:
	@echo "$(GREEN)Showing frontend logs...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) logs -f

# ===========================
# Backend Commands
# ===========================
.PHONY: back-up back-down back-build back-logs migrate migrate-dev studio seed

back-up:
	@echo "$(GREEN)Starting backend...$(NC)"
	docker-compose -f $(BACK_COMPOSE) up -d

back-down:
	@echo "$(GREEN)Stopping backend...$(NC)"
	docker-compose -f $(BACK_COMPOSE) down

back-build:
	@echo "$(GREEN)Building backend Docker image (no cache)...$(NC)"
	docker-compose -f $(BACK_COMPOSE) build 

back-logs:
	@echo "$(GREEN)Showing backend logs...$(NC)"
	docker-compose -f $(BACK_COMPOSE) logs -f

migrate:
	@echo "$(GREEN)Applying Prisma migrations (deploy)...$(NC)"
	docker-compose -f $(BACK_COMPOSE) exec $(SERVICE) npx prisma migrate deploy

migrate-dev:
	@echo "$(GREEN)Running Prisma migrate dev (development mode)...$(NC)"
	docker-compose -f $(BACK_COMPOSE) exec $(SERVICE) npx prisma migrate dev

studio:
	@echo "$(GREEN)Launching Prisma Studio...$(NC)"
	docker-compose -f $(BACK_COMPOSE) exec $(SERVICE) npx prisma studio

seed:
	@echo "$(GREEN)Running Prisma seed...$(NC)"
	docker-compose -f $(BACK_COMPOSE) exec $(SERVICE) npx prisma db seed

# ===========================
# LMS (Frontend + Backend only)
# ===========================
.PHONY: lms-up lms-down lms-logs lms-build

lms-up:
	@echo "$(GREEN)Starting LMS (frontend + backend only)...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) up -d
	docker-compose -f $(BACK_COMPOSE) up -d

lms-down:
	@echo "$(GREEN)Stopping LMS (frontend + backend only)...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) down
	docker-compose -f $(BACK_COMPOSE) down

lms-logs:
	@echo "$(GREEN)Showing logs for LMS (frontend + backend only)...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) logs -f &
	docker-compose -f $(BACK_COMPOSE) logs -f

lms-build:
	@echo "$(GREEN)Building LMS (frontend + backend only, no cache)...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) build --no-cache
	docker-compose -f $(BACK_COMPOSE) build --no-cache

# ===========================
# Jitsi Commands
# ===========================
.PHONY: jitsi-up jitsi-down jitsi-logs jitsi-build

jitsi-up:
	@echo "$(GREEN)Starting Jitsi (with Jibri)...$(NC)"
	docker-compose -f $(JITSI_COMPOSE) -f $(JITSI_JIBRI) up -d

jitsi-down:
	@echo "$(GREEN)Stopping Jitsi...$(NC)"
	docker-compose -f $(JITSI_COMPOSE) -f $(JITSI_JIBRI) down

jitsi-logs:
	@echo "$(GREEN)Showing Jitsi logs...$(NC)"
	docker-compose -f $(JITSI_COMPOSE) -f $(JITSI_JIBRI) logs -f

jitsi-build:
	@echo "$(GREEN)Building Jitsi Docker images (no cache)...$(NC)"
	docker-compose -f $(JITSI_COMPOSE) -f $(JITSI_JIBRI) build --no-cache
