# Lightsail + Managed DB + Nginx で Morian バックエンドを動かす手順

Vercel(フロント) + Lightsail インスタンス(backend/Redis) + Lightsail Managed Database(MySQL 8.0) 構成への移行手順。

## 0. 事前に決めること

| 項目 | 例 |
|------|-----|
| Lightsailリージョン | Tokyo (`ap-northeast-1`) |
| インスタンスプラン | 2GB / 2vCPU / 60GB SSD ($10/月) |
| Managed DBプラン | Standard 1GB / 40GB ($15/月)、HA構成にする場合は $30/月 |
| MySQLバージョン | 8.0 (Lightsail Managed DB は 5.7 非対応) |
| OS | Ubuntu 22.04 LTS |
| APIドメイン | `api.morian.example.com` |
| フロントドメイン | `morian.vercel.app` 等 |

### Railway側DBのバージョン確認 (重要)

```bash
mysql -h <railway-host> -P <port> -u <user> -p -e 'SELECT VERSION();'
```

5.7系なら 8.0 への変更が必要。Prismaスキーマには予約語の衝突は無いことを確認済み。
ただし dump 内に `DEFINER=` 句が含まれる場合は事前にsedで除去する（後述）。

## 1. Lightsail Managed Database 作成

1. AWSコンソール → Lightsail → Databases → Create database
2. リージョン: 東京
3. Database engine: **MySQL 8.0.x**
4. プラン: Standard $15/month (1GB RAM / 40GB SSD)
5. データベース名: `morian`
6. Master username: `dbmasteruser` (デフォルトのまま推奨)
7. Master password: 強パスワードを設定 (`openssl rand -base64 24` で生成、控えておく)
8. 識別子: `morian-db`
9. Public mode: **OFF**（同リージョンの Lightsail インスタンスからのみアクセス可。デフォルト）
10. 作成完了まで5-15分待つ → State が "Available" になる
11. **Connect details** タブから次の値を控える:
    - Endpoint (例: `ls-xxxx.xxxx.ap-northeast-1.rds.amazonaws.com`)
    - Port: 3306
    - Master user / password

## 2. Lightsail インスタンス作成

1. AWSコンソール → Lightsail → Create instance
2. リージョン: 東京（Managed DBと**同一リージョン必須**）
3. Linux / Ubuntu 22.04 LTS / プラン $10
4. 名前: `morian-prod`
5. Networking → **Static IP** を作成しアタッチ
6. Firewall で以下を Allow
   - SSH (22, MySource推奨)
   - HTTP (80)
   - HTTPS (443)
7. DNS: ドメインのAレコードを Static IP に向ける（例: `api.morian.example.com` → `xx.xx.xx.xx`）

## 3. 初期セットアップ（SSHログイン後）

```bash
sudo apt update && sudo apt -y upgrade
sudo timedatectl set-timezone Asia/Tokyo

# Swap (2GBインスタンスはメモリ不足で詰まりやすいので保険)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
# 一度ログアウト→再ログイン

# Nginx + certbot + mysql-client (バックアップ・リストア用)
sudo apt -y install nginx certbot python3-certbot-nginx mysql-client
```

## 4. Managed DB への疎通確認

Lightsail インスタンスから Managed DB に繋がるか確認:

```bash
mysql -h ls-xxxx.xxxx.ap-northeast-1.rds.amazonaws.com -u dbmasteruser -p
# パスワード入力 → mysql プロンプトが出ればOK
mysql> SHOW DATABASES;
mysql> exit;
```

繋がらない場合: Managed DB と インスタンスが**同一リージョン**にあるか、Public mode 不要 (同リージョンの Lightsail 間は自動でアクセス可) を再確認。

## 5. リポジトリ配置

```bash
sudo mkdir -p /opt/morian
sudo chown ubuntu:ubuntu /opt/morian
cd /opt/morian
git clone https://github.com/sutefu23/morian.git .

cp .env.prod.example .env.prod
chmod 600 .env.prod
nano .env.prod
```

`.env.prod` に Step 1 で控えた Managed DB の接続情報を `API_DATABASE_URL` にセット。
`API_SALT` は **Railway の値を必ず引き継ぐ** (新規生成すると全パスワード認証不能)。

## 6. 既存DBの移行

### 6-1. Railway から dump 取得

```bash
# ローカルから (sshトンネル不要、Railwayの公開エンドポイント経由)
mysqldump -h <railway-host> -P <port> -u <user> -p \
  --single-transaction --quick --routines --triggers \
  --set-gtid-purged=OFF --column-statistics=0 \
  morian > morian-backup.sql

# DEFINER句を除去 (Managed DB の権限制約に対応)
sed -i.bak -E 's/DEFINER=`[^`]+`@`[^`]+`//g' morian-backup.sql
sed -i.bak2 -E '/^CREATE DEFINER/d' morian-backup.sql

gzip morian-backup.sql

# Lightsail インスタンスへ転送
scp morian-backup.sql.gz ubuntu@<static-ip>:/opt/morian/
```

### 6-2. Managed DB へインポート

```bash
ssh ubuntu@<static-ip>
cd /opt/morian
set -a; source .env.prod; set +a

# 接続URL から接続情報を抽出
DB_USER=$(echo "$API_DATABASE_URL" | sed -E 's|mysql://([^:]+):.*|\1|')
DB_PASS=$(echo "$API_DATABASE_URL" | sed -E 's|mysql://[^:]+:([^@]+)@.*|\1|')
DB_HOST=$(echo "$API_DATABASE_URL" | sed -E 's|.*@([^:/]+).*|\1|')

# データベース作成 (Managed DB 作成時に morian DB は自動作成済みだが念のため)
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS morian CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# インポート
gunzip -c morian-backup.sql.gz | \
  mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" morian
```

外部キー制約で詰まる場合は dump の先頭に `SET FOREIGN_KEY_CHECKS=0;`、末尾に `SET FOREIGN_KEY_CHECKS=1;` を追記。

Railway由来の dump には `_prisma_migrations` テーブルも含まれるので、この後 backend が起動して `prisma migrate deploy` を走らせても**何も適用されない**（idempotent）。

## 7. backend + redis 起動

```bash
cd /opt/morian
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build

docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
```

ヘルスチェック: `curl http://127.0.0.1:3000/api/...`（既存の認可不要エンドポイントで）。

## 8. Nginx 設定

```bash
sudo cp /opt/morian/infra/nginx/api.conf /etc/nginx/sites-available/morian-api
sudo sed -i 's/api.example.com/api.morian.example.com/g' /etc/nginx/sites-available/morian-api
sudo ln -s /etc/nginx/sites-available/morian-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 一旦 SSL ブロックをコメントアウトしてHTTPだけで起動
sudo nano /etc/nginx/sites-available/morian-api  # ssl_certificate 関連を一時コメントアウト

sudo nginx -t && sudo systemctl reload nginx
```

## 9. Let's Encrypt 証明書取得

```bash
sudo certbot --nginx -d api.morian.example.com \
  --non-interactive --agree-tos -m admin@example.com --redirect
```

certbot が自動でNginx設定を書き換えてHTTPS有効化＋自動更新cron登録までやってくれる。

## 10. Vercel側の切替

`next.config.js` は `output: 'export'`（静的書き出し）なので、APIエンドポイントURL は**ビルド時に埋め込まれます**。

```
NEXT_PUBLIC_API_ORIGIN=https://api.morian.example.com
```
13.230.159.51
を Vercel プロジェクトの環境変数に設定後、**必ず Production を Redeploy**（Deployments → 該当を ⋯ → Redeploy）。

加えて、**CORS設定**:
- `.env.prod` の `HOST` 変数を **フロントエンドのドメイン** (`https://morian.vercel.app` 等) に設定
- Vercel プレビューデプロイ (`*-xxx.vercel.app`) は単一文字列originなので **CORS で弾かれる**

## 11. バックアップ + uploads クリーンアップ

### Managed DB の自動バックアップ

Lightsail Managed Database は**自動で日次スナップショット**を取得・7日間保持してくれる（標準機能、追加料金なし）。

加えて、念のため**オフサイトバックアップ**（インスタンス側に圧縮 dump を保管）も入れる:

```bash
chmod +x /opt/morian/infra/backup-db.sh
crontab -e
```

```cron
# 日次DBバックアップ (3:30、オフサイト保存用)
30 3 * * * /opt/morian/infra/backup-db.sh >> /opt/morian/infra/backups/backup.log 2>&1

# 一時アップロードファイルのクリーンアップ (毎日4:00 / 7日より古いファイルを削除)
0 4 * * * docker exec backend-morian sh -c "find /uploads -type f -mtime +7 -delete" >> /opt/morian/infra/backups/cleanup.log 2>&1
```

加えて Lightsail コンソールで **インスタンスの Automatic snapshots** を ON（東京時間4:30推奨）。
`uploads` Dockerボリュームも丸ごとスナップショットに含まれる。

> **保持期間調整**: `-mtime +7` は業務に合わせて調整。`+1` で十分なら厳しめに、`+30` まで残すなら緩めに。

> **Managed DB の手動スナップショット**: Lightsail コンソール → Database → Snapshots タブから任意のタイミングで取得可能（追加課金あり: $0.05/GB/月）。

## 12. 運用コマンド早見表

```bash
# ログ
docker compose -f docker-compose.prod.yml logs -f backend

# 再起動
docker compose -f docker-compose.prod.yml restart backend

# デプロイ更新
cd /opt/morian
git pull
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build backend

# Managed DB シェル
set -a; source .env.prod; set +a
DB_HOST=$(echo "$API_DATABASE_URL" | sed -E 's|.*@([^:/]+).*|\1|')
DB_USER=$(echo "$API_DATABASE_URL" | sed -E 's|mysql://([^:]+):.*|\1|')
mysql -h "$DB_HOST" -u "$DB_USER" -p morian

# uploads 確認
docker compose -f docker-compose.prod.yml exec backend ls -la /uploads
```

## 13. CORS / Vercel 動的ドメイン対応 (任意)

`*.vercel.app` のプレビューデプロイも許可したい場合は `app/server/service/app.ts` の CORS 設定を関数か配列に変更:

```ts
app.register(cors, {
  origin: (origin, cb) => {
    const allowed = [
      'https://morian.vercel.app',
      /^https:\/\/morian-[a-z0-9-]+-<team-name>\.vercel\.app$/
    ]
    if (!origin || allowed.some(p => typeof p === 'string' ? p === origin : p.test(origin))) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'), false)
    }
  }
})
```

## 14. 切り戻し手順

Railway を**1〜2週間並行稼働**させ、DNSは TTL 300秒で運用。問題があれば Vercel 環境変数を Railway URL に戻して再デプロイすれば即時ロールバック可能。

Managed DB側にも問題が出た場合は、Lightsail コンソール → Database → Snapshots から「Create new database from snapshot」で過去状態に巻き戻せる（新規DBとして復元、エンドポイントが変わるので `.env.prod` 差し替え）。

## 15. 移行完了後のクリーンアップ

旧 Railway構成の名残として `docker-compose.prod.override.yml` がリポジトリに残っている。
新構成は `docker-compose.prod.yml` に統合されているので、十分に安定運用できたら削除する:

```bash
git rm docker-compose.prod.override.yml
git commit -m "remove legacy railway override"
```

## 補足: Prisma binaryTargets

`prisma/schema.prisma` の `generator client` に `binaryTargets` が未指定。
現状は alpine 内で `prisma generate` を実行するDockerビルドなので自動検出されて動くが、ビルド環境を変える可能性があるなら明示しておくと安全:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["interactiveTransactions"]
  binaryTargets   = ["native", "linux-musl"]
}
```

変更後は `npm run generate` で Prisma Client を再生成。
