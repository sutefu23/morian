#!/bin/bash
#
# Morian - Lightsail 環境構築スクリプト
#
# 前提:
#   - Lightsail Ubuntu 22.04 LTS インスタンス ($5プラン: 1GB RAM, 1 vCPU)
#   - MySQL, Redis, Fastify, Nginx すべて1台に同居
#   - このスクリプトを root または sudo 権限で実行
#
# 使い方:
#   1. Lightsail インスタンスに SSH 接続
#   2. このスクリプトをアップロード
#   3. chmod +x setup.sh && sudo ./setup.sh
#
set -euo pipefail

# ─────────────────────────────────────────────────
# 設定値（デプロイ前に必ず編集してください）
# ─────────────────────────────────────────────────
APP_USER="morian"
APP_DIR="/opt/morian"
DOMAIN="morian-zaiko.info"  # あなたのドメインに変更

# MySQL（ローカル）
DB_NAME="morian"
DB_USER="morian"
DB_PASS="$(openssl rand -hex 16)"  # 自動生成（または任意のパスワードに変更）

# アプリケーション設定
API_SERVER_PORT="30743"
API_JWT_SECRET="$(openssl rand -hex 32)"
API_SALT="$(openssl rand -hex 16)"
DEFAULT_USER_PASS="changeme"

# Redis（ローカル）
REDIS_HOST="localhost"
REDIS_PORT="6379"

# Git リポジトリ
GIT_REPO="https://github.com/sutefu23/morian.git"  # リポジトリURL
GIT_BRANCH="master"

echo "============================================"
echo " Morian 環境構築開始"
echo "============================================"

# ─────────────────────────────────────────────────
# 1. システムアップデート & 基本パッケージ
# ─────────────────────────────────────────────────
echo "[1/9] システムアップデート..."
apt-get update && apt-get upgrade -y
apt-get install -y \
  curl \
  git \
  build-essential \
  nginx \
  certbot \
  python3-certbot-nginx \
  redis-server \
  ufw

# ─────────────────────────────────────────────────
# 2. MySQL 5.7 インストール
# ─────────────────────────────────────────────────
echo "[2/9] MySQL インストール..."
if ! command -v mysqld &> /dev/null; then
  # Ubuntu 22.04 では MySQL 8 がデフォルト
  # MySQL 5.7 が必要な場合は 8 でも Prisma は互換性あり
  apt-get install -y mysql-server
fi

# MySQL セキュリティ & メモリ最適化（1GB インスタンス向け）
cat > /etc/mysql/mysql.conf.d/morian.cnf <<'MYSQLCONF'
[mysqld]
# メモリ節約設定（1GB インスタンス用）
innodb_buffer_pool_size = 128M
innodb_log_file_size = 32M
innodb_flush_log_at_trx_commit = 2
max_connections = 20
key_buffer_size = 8M
table_open_cache = 64
sort_buffer_size = 256K
read_buffer_size = 256K
thread_cache_size = 4
# query_cache_size は MySQL 8 で削除済みのため省略

# 文字コード
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# タイムゾーン
default-time-zone = '+09:00'
MYSQLCONF

systemctl enable mysql
systemctl restart mysql

# データベース & ユーザー作成
mysql -u root <<MYSQL_SETUP
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SETUP

echo "MySQL データベース '${DB_NAME}' 作成完了"

# ─────────────────────────────────────────────────
# 3. アプリケーションユーザー作成
# ─────────────────────────────────────────────────
echo "[3/9] アプリケーションユーザー作成..."
if ! id "$APP_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$APP_USER"
fi

mkdir -p "$APP_DIR"
chown "$APP_USER:$APP_USER" "$APP_DIR"

# ─────────────────────────────────────────────────
# 4. Volta & Node.js インストール（morian ユーザーに）
# ─────────────────────────────────────────────────
echo "[4/9] Volta & Node.js インストール..."
sudo -u "$APP_USER" bash <<'VOLTA_SETUP'
set -euo pipefail
if ! command -v volta &> /dev/null; then
  curl https://get.volta.sh | bash
fi
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"

volta install node@22
volta install yarn
volta install pm2

echo "Volta: $(volta -v)"
echo "Node.js: $(node -v)"
echo "yarn: $(yarn -v)"
VOLTA_SETUP

# root からも morian ユーザーの Volta を参照できるよう PATH に追加
MORIAN_VOLTA="/home/${APP_USER}/.volta/bin"
if ! grep -q "VOLTA_HOME" /etc/environment 2>/dev/null; then
  echo "VOLTA_HOME=/home/${APP_USER}/.volta" >> /etc/environment
fi
export PATH="${MORIAN_VOLTA}:$PATH"

# ─────────────────────────────────────────────────
# 5. Redis 設定
# ─────────────────────────────────────────────────
echo "[5/9] Redis 設定..."
mkdir -p /etc/redis/redis.conf.d

cat > /etc/redis/redis.conf.d/morian.conf <<'REDIS_CONF'
maxmemory 64mb
maxmemory-policy allkeys-lru
REDIS_CONF

if ! grep -q "include /etc/redis/redis.conf.d/" /etc/redis/redis.conf 2>/dev/null; then
  echo "include /etc/redis/redis.conf.d/*.conf" >> /etc/redis/redis.conf
fi

systemctl enable redis-server
systemctl restart redis-server

# ─────────────────────────────────────────────────
# 6. スワップ領域作成（1GB インスタンスのメモリ補助）
# ─────────────────────────────────────────────────
echo "[6/9] スワップ設定..."
if [ ! -f /swapfile ]; then
  fallocate -l 1G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  # スワップ使用を控えめに（メモリ優先）
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
  echo "1GB スワップ作成完了"
else
  echo "スワップは既に存在"
fi

# ─────────────────────────────────────────────────
# 7. アプリケーションのクローン & ビルド
# ─────────────────────────────────────────────────
echo "[7/9] アプリケーションセットアップ..."
sudo -u "$APP_USER" bash <<APPSETUP
set -euo pipefail
export VOLTA_HOME="/home/${APP_USER}/.volta"
export PATH="\$VOLTA_HOME/bin:\$PATH"
cd "$APP_DIR"

# リポジトリクローン（初回のみ）
if [ ! -d "$APP_DIR/app" ]; then
  git clone --branch "$GIT_BRANCH" "$GIT_REPO" .
fi

# サーバー環境変数ファイル作成
cat > "$APP_DIR/app/server/.env.production" <<ENV
HOST=https://${DOMAIN}
API_SERVER_PORT=${API_SERVER_PORT}
API_BASE_PATH=/api
API_ORIGIN=https://${DOMAIN}
API_JWT_SECRET=${API_JWT_SECRET}
API_UPLOAD_DIR=${APP_DIR}/uploads
API_SALT=${API_SALT}
DEFAULT_USER_PASS=${DEFAULT_USER_PASS}
API_DATABASE_URL=mysql://${DB_USER}:${DB_PASS}@localhost:3306/${DB_NAME}
NODE_ENV=production
REDIS_HOST=${REDIS_HOST}
REDIS_POST=${REDIS_PORT}
REDIS_USERNAME=
REDIS_PASSWORD=
ENV

# アップロードディレクトリ作成
mkdir -p "$APP_DIR/uploads"

# .env.production のパーミッション設定（機密情報保護）
chmod 600 "$APP_DIR/app/server/.env.production"

# 依存関係インストール
cd "$APP_DIR/app"
yarn install --frozen-lockfile

cd "$APP_DIR/app/server"
yarn install --frozen-lockfile

# Prisma マイグレーション実行
cd "$APP_DIR/app/server"
npx dotenv -e .env.production -- npx prisma migrate deploy

# ビルド
cd "$APP_DIR/app"
yarn build:server
yarn build:client
APPSETUP

# ─────────────────────────────────────────────────
# 8. PM2 設定
# ─────────────────────────────────────────────────
echo "[8/9] PM2 設定..."
cat > "$APP_DIR/ecosystem.config.js" <<PM2CONF
module.exports = {
  apps: [
    {
      name: 'morian-api',
      script: 'index.js',
      cwd: '${APP_DIR}/app/server/',
      instances: 1,
      exec_mode: 'fork',
      wait_ready: true,
      listen_timeout: 10000,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        HOST: 'https://${DOMAIN}',
        API_SERVER_PORT: '${API_SERVER_PORT}',
        API_BASE_PATH: '/api',
        API_ORIGIN: 'https://${DOMAIN}',
        API_JWT_SECRET: '${API_JWT_SECRET}',
        API_UPLOAD_DIR: '${APP_DIR}/uploads',
        API_SALT: '${API_SALT}',
        DEFAULT_USER_PASS: '${DEFAULT_USER_PASS}',
        API_DATABASE_URL: 'mysql://${DB_USER}:${DB_PASS}@localhost:3306/${DB_NAME}',
        REDIS_HOST: '${REDIS_HOST}',
        REDIS_POST: '${REDIS_PORT}',
        REDIS_USERNAME: '',
        REDIS_PASSWORD: ''
      }
    }
  ]
}
PM2CONF

chown "$APP_USER:$APP_USER" "$APP_DIR/ecosystem.config.js"

# PM2 でアプリ起動
sudo -u "$APP_USER" bash -c "export VOLTA_HOME=/home/${APP_USER}/.volta && export PATH=\$VOLTA_HOME/bin:\$PATH && pm2 start $APP_DIR/ecosystem.config.js && pm2 save"

# PM2 自動起動設定（Volta の PATH を含む環境で起動するよう設定）
env PATH="/home/${APP_USER}/.volta/bin:$PATH" pm2 startup systemd -u "$APP_USER" --hp "/home/$APP_USER"

# ─────────────────────────────────────────────────
# 9. Nginx & ファイアウォール設定
# ─────────────────────────────────────────────────
echo "[9/9] Nginx & ファイアウォール設定..."
cat > /etc/nginx/sites-available/morian <<NGINX
server {
    listen 80;
    server_name ${DOMAIN};

    # フロントエンド（静的ファイル配信）
    root ${APP_DIR}/app/out;
    index index.html;

    # gzip 圧縮
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 256;

    # 静的アセットキャッシュ
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API リバースプロキシ
    location /api/ {
        proxy_pass http://127.0.0.1:${API_SERVER_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # ファイルアップロード対応
        client_max_body_size 20M;
    }

    # SPA フォールバック（trailingSlash: true 対応）
    location / {
        try_files \$uri \$uri/ \$uri/index.html /index.html;
    }
}
NGINX

# サイト有効化
ln -sf /etc/nginx/sites-available/morian /etc/nginx/sites-enabled/morian
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable nginx
systemctl restart nginx

# ファイアウォール
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable

# ─────────────────────────────────────────────────
# MySQL 自動バックアップ設定（日次）
# ─────────────────────────────────────────────────
mkdir -p /opt/backups/mysql
cat > /opt/backups/backup-mysql.sh <<'BACKUP'
#!/bin/bash
BACKUP_DIR="/opt/backups/mysql"
DB_NAME="morian"
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root "$DB_NAME" | gzip > "${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz"
# 7日以上前のバックアップを削除
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
BACKUP
chmod +x /opt/backups/backup-mysql.sh

# cron 登録（毎日 AM 3:00）
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/backups/backup-mysql.sh") | sort -u | crontab -

echo ""
echo "============================================"
echo " セットアップ完了！"
echo "============================================"
echo ""
echo "構成:"
echo "  Nginx (:80/443) → 静的ファイル + API プロキシ"
echo "  Fastify (:${API_SERVER_PORT}) → API サーバー"
echo "  MySQL (:3306) → データベース（ローカル）"
echo "  Redis (:6379) → キャッシュ（ローカル）"
echo ""
echo "次のステップ:"
echo ""
echo "1. ドメインのDNSをこのインスタンスのIPに向ける"
echo ""
echo "2. SSL証明書を取得:"
echo "   sudo certbot --nginx -d ${DOMAIN}"
echo ""
echo "3. シードデータ投入（必要な場合）:"
echo "   sudo -u ${APP_USER} bash -c 'cd ${APP_DIR}/app/server && npx dotenv -e .env.production -- npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./prisma/seed.ts'"
echo ""
echo "4. 動作確認:"
echo "   curl http://localhost:${API_SERVER_PORT}/api"
echo "   curl http://localhost"
echo ""
echo "============================================"
echo " 生成されたパスワード（必ず控えてください）"
echo "============================================"
echo "  DB パスワード:    ${DB_PASS}"
echo "  API_JWT_SECRET:  ${API_JWT_SECRET}"
echo "  API_SALT:        ${API_SALT}"
echo ""
echo "※ これらの値は ${APP_DIR}/app/server/.env.production に保存されています"
echo "※ MySQL バックアップ: 毎日 AM 3:00 → /opt/backups/mysql/"
echo ""
