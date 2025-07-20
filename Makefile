# ===========================
# Variables
# ===========================
FRONT_COMPOSE=./frontend/docker-compose.yml
BACK_COMPOSE=./backend/docker-compose.yml
SERVICE=backend

GREEN=\033[0;32m
NC=\033[0m # No Color

# ===========================
# Global Commands
# ===========================
.PHONY: up down restart logs build-all

up:
	@echo "$(GREEN)Starting frontend and backend...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) up -d
	docker-compose -f $(BACK_COMPOSE) up -d

down:
	@echo "$(GREEN)Stopping frontend and backend...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) down
	docker-compose -f $(BACK_COMPOSE) down

restart:
	@echo "$(GREEN)Restarting frontend and backend...$(NC)"
	make down
	make up

logs:
	@echo "$(GREEN)Showing logs for frontend and backend...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) logs -f &
	docker-compose -f $(BACK_COMPOSE) logs -f

build-all:
	@echo "$(GREEN)Building Docker images for frontend and backend...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) build
	docker-compose -f $(BACK_COMPOSE) build

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
	@echo "$(GREEN)Building frontend Docker image...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) build

front-logs:
	@echo "$(GREEN)Showing frontend logs...$(NC)"
	docker-compose -f $(FRONT_COMPOSE) logs -f

# ===========================
# Backend Commands
# ===========================
.PHONY: back-up back-down back-build back-logs migrate migrate-dev studio

back-up:
	@echo "$(GREEN)Starting backend...$(NC)"
	docker-compose -f $(BACK_COMPOSE) up -d

back-down:
	@echo "$(GREEN)Stopping backend...$(NC)"
	docker-compose -f $(BACK_COMPOSE) down

back-build:
	@echo "$(GREEN)Building backend Docker image...$(NC)"
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
