#!/bin/sh
set -e

mkdir -p "${API_UPLOAD_DIR:-/uploads}"

echo "[entrypoint] Running prisma migrate deploy..."
npx prisma migrate deploy

echo "[entrypoint] Starting server: $@"
exec "$@"
