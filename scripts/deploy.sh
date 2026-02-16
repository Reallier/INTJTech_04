#!/bin/bash
echo "Starting INTJsys Official Site deployment process..."

set -e  # 遇到错误立即退出

# SSH 密钥路径（Mac）
SSH_KEY="${SSH_KEY:-$HOME/Downloads/reallier.pem}"

echo "Building Docker image (linux/amd64)..."
docker buildx build --platform linux/amd64 --no-cache -t intjsys-official:latest --load .

echo "Tagging Docker image..."
docker tag intjsys-official:latest ccr.ccs.tencentyun.com/reallier/intjsys-official:latest

echo "Pushing Docker image..."
docker push ccr.ccs.tencentyun.com/reallier/intjsys-official:latest

echo "Connecting to server and updating containers..."
ssh -i "$SSH_KEY" root@119.29.166.51 "cd /data/app-stack/intjtech && docker compose pull && docker compose up -d"

echo "Deployment completed successfully!"
