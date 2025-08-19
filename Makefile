# Carden App - AWS EC2 Deployment Makefile

# Configuration
IMAGE_NAME = carden-app
IMAGE_TAG = latest
CONTAINER_NAME = carden-container
EC2_HOST = 18.209.15.178
EC2_USER = admin
EC2_KEY_PATH = /home/yanaa/Documents/projects/cardemy/carden_key_frontend_aws.pem
API_URL = http://104.214.171.2:8080/api

# Colors for output
GREEN = \033[0;32m
BLUE = \033[0;34m
YELLOW = \033[1;33m
NC = \033[0m # No Color

.PHONY: help build test push deploy clean setup-ec2

help: ## Show this help message
	@echo "$(BLUE)Carden App Deployment Commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

build: ## Build Docker image locally
	@echo "$(YELLOW)📦 Building Docker image...$(NC)"
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .
	@echo "$(GREEN)✅ Image built successfully!$(NC)"

test: build ## Build and test Docker image locally
	@echo "$(YELLOW)🧪 Testing Docker container...$(NC)"
	@docker run -d --name $(CONTAINER_NAME)-test -p 3001:3000 \
		-e NODE_ENV=production \
		-e NEXT_TELEMETRY_DISABLED=1 \
		-e NEXT_PUBLIC_API_URL=$(API_URL) \
		$(IMAGE_NAME):$(IMAGE_TAG)
	@sleep 5
	@echo "$(BLUE)Testing app response...$(NC)"
	@curl -I http://localhost:3001 && echo "$(GREEN)✅ App is responding!$(NC)" || echo "$(RED)❌ App test failed$(NC)"
	@docker stop $(CONTAINER_NAME)-test
	@docker rm $(CONTAINER_NAME)-test
	@echo "$(GREEN)🧹 Test cleanup completed$(NC)"

save-image: build ## Build and save Docker image to tar file
	@echo "$(YELLOW)💾 Saving Docker image...$(NC)"
	docker save -o carden-app.tar $(IMAGE_NAME):$(IMAGE_TAG)
	@echo "$(GREEN)✅ Image saved to carden-app.tar$(NC)"

upload: save-image ## Upload Docker image to EC2
	@echo "$(YELLOW)📤 Uploading image to EC2...$(NC)"
	scp -i $(EC2_KEY_PATH) carden-app.tar $(EC2_USER)@$(EC2_HOST):~/
	@echo "$(GREEN)✅ Upload completed!$(NC)"

deploy: upload ## Full deployment to EC2
	@echo "$(YELLOW)🚀 Deploying to EC2...$(NC)"
	@ssh -i $(EC2_KEY_PATH) $(EC2_USER)@$(EC2_HOST) '\
		echo "Loading Docker image..." && \
		docker load -i ~/carden-app.tar && \
		echo "Stopping existing container..." && \
		docker stop $(CONTAINER_NAME) 2>/dev/null || true && \
		docker rm $(CONTAINER_NAME) 2>/dev/null || true && \
		echo "Starting new container..." && \
		docker run -d \
			--name $(CONTAINER_NAME) \
			-p 80:3000 \
			-e NODE_ENV=production \
			-e NEXT_TELEMETRY_DISABLED=1 \
			-e NEXT_PUBLIC_API_URL=$(API_URL) \
			--restart unless-stopped \
			$(IMAGE_NAME):$(IMAGE_TAG) && \
		echo "Cleaning up..." && \
		rm ~/carden-app.tar && \
		echo "✅ Deployment completed!" && \
		docker ps | grep $(CONTAINER_NAME)'
	@rm carden-app.tar
	@echo "$(GREEN)🎉 Deployment finished successfully!$(NC)"

deploy-compose: ## Deploy using docker-compose (if compose file exists on EC2)
	@echo "$(YELLOW)🚀 Deploying with docker-compose...$(NC)"
	@ssh -i $(EC2_KEY_PATH) $(EC2_USER)@$(EC2_HOST) '\
		cd ~/carden-app && \
		docker-compose down && \
		docker-compose up -d --build'
	@echo "$(GREEN)🎉 Docker Compose deployment completed!$(NC)"

logs: ## View application logs on EC2
	@echo "$(BLUE)📋 Viewing application logs...$(NC)"
	@ssh -i $(EC2_KEY_PATH) $(EC2_USER)@$(EC2_HOST) 'docker logs $(CONTAINER_NAME) -f'

status: ## Check application status on EC2
	@echo "$(BLUE)📊 Checking application status...$(NC)"
	@ssh -i $(EC2_KEY_PATH) $(EC2_USER)@$(EC2_HOST) '\
		echo "=== Container Status ===" && \
		docker ps | grep $(CONTAINER_NAME) && \
		echo "=== Container Stats ===" && \
		docker stats $(CONTAINER_NAME) --no-stream && \
		echo "=== System Resources ===" && \
		free -h && df -h'

restart: ## Restart application container on EC2
	@echo "$(YELLOW)🔄 Restarting application...$(NC)"
	@ssh -i $(EC2_KEY_PATH) $(EC2_USER)@$(EC2_HOST) 'docker restart $(CONTAINER_NAME)'
	@echo "$(GREEN)✅ Application restarted!$(NC)"

stop: ## Stop application on EC2
	@echo "$(YELLOW)⏹️  Stopping application...$(NC)"
	@ssh -i $(EC2_KEY_PATH) $(EC2_USER)@$(EC2_HOST) 'docker stop $(CONTAINER_NAME)'
	@echo "$(GREEN)✅ Application stopped!$(NC)"

clean: ## Clean up local Docker images and containers
	@echo "$(YELLOW)🧹 Cleaning up local Docker resources...$(NC)"
	@docker stop $(CONTAINER_NAME)-test 2>/dev/null || true
	@docker rm $(CONTAINER_NAME)-test 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true
	@rm -f carden-app.tar
	@echo "$(GREEN)✅ Cleanup completed!$(NC)"

setup-config: ## Setup configuration (update EC2 details in Makefile)
	@echo "$(BLUE)📝 Current configuration:$(NC)"
	@echo "  EC2_HOST: $(EC2_HOST)"
	@echo "  EC2_USER: $(EC2_USER)"
	@echo "  EC2_KEY_PATH: $(EC2_KEY_PATH)"
	@echo "  API_URL: $(API_URL)"
	@echo ""
	@echo "$(YELLOW)To update configuration, edit the Makefile variables at the top$(NC)"

# Quick deployment workflow
quick-deploy: test deploy ## Build, test, and deploy in one command

# Development helpers
dev-build: ## Build for development with latest changes
	@echo "$(YELLOW)🔨 Building development image...$(NC)"
	docker build --no-cache -t $(IMAGE_NAME):dev .

dev-run: ## Run container locally for development testing
	@echo "$(YELLOW)🚀 Running development container...$(NC)"
	docker run -it --rm -p 3000:3000 \
		-e NODE_ENV=development \
		-e NEXT_PUBLIC_API_URL=$(API_URL) \
		$(IMAGE_NAME):dev
