#!/bin/bash
#
# Morian - デプロイスクリプト（更新時に使用）
#
# 使い方:
#   sudo -u morian ./deploy.sh
#
set -euo pipefail

APP_DIR="/opt/morian"

# Volta PATH 設定
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"

echo "=== Morian デプロイ開始 ==="

cd "$APP_DIR"

# 最新コードを取得
echo "[1/5] git pull..."
git pull origin master

# 依存関係更新
echo "[2/5] 依存関係インストール..."
cd "$APP_DIR/app"
yarn install --frozen-lockfile
cd "$APP_DIR/app/server"
yarn install --frozen-lockfile

# マイグレーション
echo "[3/5] DBマイグレーション..."
cd "$APP_DIR/app/server"
npx dotenv -e .env.production -- npx prisma migrate deploy

# ビルド
echo "[4/5] ビルド..."
cd "$APP_DIR/app"
yarn build:server
yarn build:client

# PM2 再起動
echo "[5/5] アプリ再起動..."
pm2 restart morian-api

echo "=== デプロイ完了 ==="
