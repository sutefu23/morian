# Morian - 木材在庫管理システム

## プロジェクト概要

木材の在庫管理・発注・入出庫履歴を管理するフルスタックWebアプリケーション。
木材の樹種・等級・寸法などを管理し、バーコード・PDF・Excel出力に対応。

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 14 + React 18 + TypeScript 5.2 |
| UIライブラリ | Chakra UI 2 + Emotion (CSS-in-JS) |
| 状態管理 | Recoil + React Query 3 |
| API通信 | Aspida + Axios (型安全なAPIクライアント) |
| バックエンド | Fastify 4.24 + Frourio (型安全なAPIフレームワーク) |
| データベース | MySQL 5.7 (Prisma 5.3 ORM) |
| キャッシュ | Redis 3.1 |
| 認証 | JWT (@fastify/jwt) + bcrypt |
| バリデーション | Zod 3.22 |
| インフラ | Docker Compose + PM2 |

## ディレクトリ構成

```
morian/
├── docker-compose.yml          # 開発環境 (MySQL + phpMyAdmin)
├── docker-compose.prod.override.yml  # 本番環境オーバーライド
├── Makefile                    # 開発コマンド (make dev, make up, etc.)
├── .env                        # PROJECT_NAME=morian
├── .nvmrc                      # Node 18.18
└── app/                        # メインアプリケーション
    ├── package.json             # frourio-app (Volta: Node 22.22)
    ├── next.config.js           # output: 'export', trailingSlash: true
    ├── tsconfig.json            # パスエイリアス設定
    ├── aspida.config.js         # Aspida設定 (input: server/api)
    ├── ecosystem.config.js      # PM2設定
    ├── pages/                   # Next.js ページ
    │   ├── index.tsx            # TOP (在庫一覧)
    │   ├── login.tsx            # ログイン
    │   ├── report.tsx           # レポート
    │   ├── item/                # 商品管理
    │   ├── issue/               # 発注管理
    │   ├── history/             # 入出庫履歴
    │   ├── master/              # マスタ管理
    │   ├── handy/               # ハンディ端末用
    │   └── pdf/                 # PDF出力
    ├── components/              # UIコンポーネント (14カテゴリ)
    │   ├── AdminLayout.tsx      # メインレイアウト
    │   ├── Navibar.tsx          # ナビバー
    │   ├── Sidebar.tsx          # サイドバー
    │   ├── select/              # 各種セレクトボックス
    │   └── ...
    ├── hooks/                   # カスタムフック (11種)
    │   ├── useStock.ts          # 在庫操作
    │   ├── useHistory.ts        # 履歴操作
    │   ├── useIssue.ts          # 発注操作
    │   ├── useUser.ts           # ユーザー操作
    │   └── ...
    ├── utils/                   # ユーティリティ
    │   ├── apiClient.ts         # Aspida APIクライアント
    │   ├── decimal.ts           # 小数フォーマット
    │   ├── number.ts            # 円表記 (toYenFormat)
    │   └── string.ts            # 全角→半角変換
    ├── types/                   # 型定義
    ├── styles/                  # CSS・テーマ設定
    ├── test/                    # テスト (@testing-library/react)
    └── server/                  # バックエンド
        ├── package.json
        ├── webpack.config.js    # サーバービルド設定
        ├── envValues.ts         # 環境変数定義
        ├── Dockerfile           # node:16-alpine ベース
        ├── api/                 # APIルート (Frourio)
        │   ├── hooks.ts         # 認証フック (JWT検証)
        │   ├── login/           # POST /api/login
        │   ├── me/              # GET/PATCH /api/me
        │   ├── user/            # ユーザーCRUD
        │   ├── item/            # 商品CRUD
        │   ├── itemList/        # 商品一覧・グループ集計
        │   ├── issue/           # 発注CRUD
        │   ├── history/         # 履歴CRUD
        │   ├── historyList/     # 履歴一覧
        │   ├── supplier/        # 仕入先管理
        │   ├── master/          # マスタデータAPI
        │   └── report/          # レポート
        ├── domain/              # DDD ドメイン層
        │   ├── entity/          # エンティティ (User, Item, Issue)
        │   ├── type/            # 値オブジェクト・エラー型
        │   ├── repository/      # リポジトリ (interface + Prisma実装)
        │   ├── service/         # ドメインサービス (Auth, Master, Stock等)
        │   ├── dto/             # DTO (Supplier, Reason)
        │   └── init/            # マスタ初期データ定義
        ├── service/             # アプリケーションサービス (11種)
        ├── validators/          # バリデーション
        ├── cache/               # Redisキャッシュクライアント
        ├── entrypoints/         # エントリポイント
        └── prisma/
            ├── schema.prisma    # DBスキーマ (15モデル)
            ├── seed.ts          # シードデータ
            └── migrations/      # 47マイグレーション

```

## TSConfig パスエイリアス

| エイリアス | パス |
|-----------|------|
| `~/*` | app ルート |
| `$/*` | server ディレクトリ |
| `@domain/*` | server/domain |
| `$prisma/*` | Prisma クライアント |
| `$decimal/*` | decimal.js |

## 主要コマンド

```bash
# 開発
make dev              # Docker起動 + yarn dev
make up / make down   # Dockerコンテナ管理
make restart          # 全体再起動

# app/ ディレクトリ内
npm run dev           # 開発サーバー起動 (クライアント + サーバー並列)
npm run build         # プロダクションビルド
npm run lint          # ESLint + Prettier チェック
npm run lint:fix      # 自動修正
npm run typecheck     # TypeScript 型チェック
npm run generate      # Aspida API型生成
npm run migrate:dev   # Prisma マイグレーション (開発)
npm run migrate:prod  # Prisma マイグレーション (本番)
```

## DBモデル概要

主要モデル: `User`, `UserPass`, `Item`, `Issue`, `IssueItem`, `History`, `Supplier`
マスタ: `ItemType`, `Species`, `Grade`, `Unit`, `Warehouse`, `DeliveryPlace`, `Reason`, `Task`

## アーキテクチャパターン

- **DDD (ドメイン駆動設計)**: Entity → Repository (interface) → Prisma実装 → Service → Controller
- **リポジトリパターン**: `IRepositoryCommand` / `IRepositoryQuery` インターフェース
- **Frourio規約**: 各APIルートに `index.ts` (型定義) + `controller.ts` (実装)
- **認証**: JWTトークンを `authorization` or `token` ヘッダーで送信。`/api/login` 以外は全ルート認証必須
- **キャッシュ**: Redis で `USER_SESSION` / `PLANE` タイプのキャッシュ

## コーディング規約

- セミコロンなし
- シングルクォート
- トレイリングカンマなし
- printWidth: 500
- TypeScript strict mode 有効
- reactStrictMode: false

## 環境変数 (server)

`HOST`, `API_JWT_SECRET`, `API_SERVER_PORT`, `API_BASE_PATH`, `API_ORIGIN`,
`API_UPLOAD_DIR`, `API_SALT`, `DEFAULT_USER_PASS`, `API_DATABASE_URL`,
`NODE_ENV`, `REDIS_HOST`, `REDIS_POST`, `REDIS_USERNAME`, `REDIS_PASSWORD`
