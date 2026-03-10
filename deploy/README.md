# Morian Lightsail デプロイ手順

## 構成概要

すべて Lightsail $5 インスタンス 1台に同居。

```
[ユーザー] → [Nginx :80/443] → 静的ファイル (Next.js export)
                              → /api/* → [Fastify :30743]
                                            ├── [MySQL :3306 ローカル]
                                            └── [Redis :6379 ローカル]
```

## コスト

| リソース | 月額 |
|---------|------|
| Lightsail Instance ($5プラン: 1GB RAM, 1 vCPU, 40GB SSD) | **$5** |
| **合計** | **$5/月（約750円）** |

## 手順

### 1. Lightsail Instance 作成

1. [Lightsail コンソール](https://lightsail.aws.amazon.com/) にログイン
2. 「インスタンスの作成」
3. 設定:
   - **OS**: Ubuntu 22.04 LTS
   - **プラン**: $5/月
   - **リージョン**: ap-northeast-1 (東京)
4. ネットワーキング:
   - 静的IPを割り当て
   - ポート 80, 443 を開放

### 2. セットアップ

```bash
# ローカルからスクリプトをアップロード
scp deploy/setup.sh ubuntu@<インスタンスIP>:~/

# SSH 接続
ssh ubuntu@<インスタンスIP>

# setup.sh 内の設定値を編集
nano ~/setup.sh
# → DOMAIN, GIT_REPO 等を設定
# → DB_PASS は自動生成されるが、固定値にしたい場合は変更

# 実行
chmod +x ~/setup.sh
sudo ./setup.sh

# ※ 出力されるパスワードを必ず控えること
```

### 3. SSL 証明書

```bash
sudo certbot --nginx -d your-domain.com
```

### 4. 更新デプロイ

```bash
sudo -u morian /opt/morian/deploy/deploy.sh
```

## メモリ内訳（$5プラン: 1GB RAM）

| プロセス | 目安 |
|---------|------|
| MySQL | ~200MB |
| Node.js (Fastify) | ~150MB (max_memory_restart: 300M) |
| Redis | ~64MB (maxmemory 制限) |
| Nginx | ~10MB |
| OS | ~200MB |
| **残り + スワップ 1GB** | 余裕あり |

## バックアップ

- MySQL: 毎日 AM 3:00 に自動ダンプ → `/opt/backups/mysql/`
- 7日分を保持、それ以前は自動削除
- 手動バックアップ: `sudo /opt/backups/backup-mysql.sh`

## トラブルシューティング

```bash
# ログ確認
sudo -u morian pm2 logs morian-api

# Nginx ログ
sudo tail -f /var/log/nginx/error.log

# MySQL ログ
sudo tail -f /var/log/mysql/error.log

# Redis 確認
redis-cli ping

# DB 接続確認
mysql -u morian -p morian

# アプリ再起動
sudo -u morian pm2 restart morian-api

# 全サービス状態確認
systemctl status mysql redis-server nginx

# メモリ使用量確認
free -h
sudo -u morian pm2 monit
```

## $5 で足りなくなった場合

$10プラン（2GB RAM, 1 vCPU）へのアップグレードはLightsailコンソールからスナップショット経由で可能。
5人程度であれば $5 で問題ないが、データ量が増えた場合は検討。
