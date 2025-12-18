#!/bin/bash
echo "Starting INTJTech deployment process..."

set -e  # 遇到错误立即退出

# SSH 密钥路径（Mac）
SSH_KEY="${SSH_KEY:-$HOME/Downloads/reallier.pem}"

echo "Building Docker image (linux/amd64)..."
docker buildx build --platform linux/amd64 --no-cache -t zilshu-tech-site:latest --load .

echo "Tagging Docker image..."
docker tag zilshu-tech-site:latest ccr.ccs.tencentyun.com/reallier/zilshu-tech-site:latest

echo "Pushing Docker image..."
docker push ccr.ccs.tencentyun.com/reallier/zilshu-tech-site:latest

echo "Connecting to server and updating containers..."
ssh -i "$SSH_KEY" root@119.29.166.51 "cd /data/app-stack/intjtech && docker compose pull && docker compose up -d"

echo "Deployment completed successfully!"
