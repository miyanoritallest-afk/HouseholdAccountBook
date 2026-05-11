#!/bin/bash
set -e

EC2_HOST="18.179.100.96"
EC2_USER="ec2-user"
SSH_KEY="$HOME/.ssh/household-account"

echo "==> Connecting to EC2 and deploying..."

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" << 'ENDSSH'
  set -e
  cd /app

  echo "==> Pulling latest code from main..."
  git pull origin main

  echo "==> Rebuilding and restarting containers..."
  docker compose -f docker-compose.prod.yml --env-file .env up -d --build

  echo "==> Running DB migrations..."
  docker compose -f docker-compose.prod.yml --env-file .env exec -T api bundle exec rails db:migrate RAILS_ENV=production

  echo "==> Waiting for API to be ready..."
  sleep 5

  echo "==> Health check..."
  curl -sf http://localhost:3000/health && echo "" && echo "Deploy succeeded!"
ENDSSH
