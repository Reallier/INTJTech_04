#!/bin/bash
echo "Starting INTJsys Domestic Site deployment process..."

set -e  # 遇到错误立即退出

# SSH 密钥路径
SSH_KEY="${SSH_KEY:-/data/intjsys/.keys/intjsys.pem}"

echo "Building Docker image..."
docker build --load -t intjsys-official:latest .

echo "Tagging Docker image..."
docker tag intjsys-official:latest ccr.ccs.tencentyun.com/reallier/intjsys-official:latest

echo "Pushing Docker image..."
docker push ccr.ccs.tencentyun.com/reallier/intjsys-official:latest

echo "Connecting to server and updating containers..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no root@119.29.166.51 "cd /data/app-stack/intjtech && docker compose pull && docker compose up -d --force-recreate --no-deps intjsys-official && docker image prune -f --filter 'dangling=true' 2>/dev/null || true"

echo "Deployment completed successfully!"
