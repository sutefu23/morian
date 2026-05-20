#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

set -a
source .env.prod
set +a

BACKUP_DIR="./infra/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILE="${BACKUP_DIR}/morian_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

# API_DATABASE_URL から接続情報を抽出
# 形式: mysql://USER:PASSWORD@HOST:PORT/DBNAME?...
DB_USER=$(echo "$API_DATABASE_URL" | sed -E 's|mysql://([^:]+):.*|\1|')
DB_PASS=$(echo "$API_DATABASE_URL" | sed -E 's|mysql://[^:]+:([^@]+)@.*|\1|')
DB_HOST=$(echo "$API_DATABASE_URL" | sed -E 's|.*@([^:/]+).*|\1|')
DB_PORT=$(echo "$API_DATABASE_URL" | sed -E 's|.*@[^:]+:([0-9]+).*|\1|')
DB_NAME=$(echo "$API_DATABASE_URL" | sed -E 's|.*/([^?]+).*|\1|')

mysqldump -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASS}" \
  --single-transaction --quick --routines --triggers \
  --set-gtid-purged=OFF --column-statistics=0 \
  "${DB_NAME}" | gzip > "${FILE}"

find "${BACKUP_DIR}" -name 'morian_*.sql.gz' -mtime +14 -delete

echo "Backup written: ${FILE}"
