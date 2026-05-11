# デプロイ手順

## 通常のデプロイ（コード更新時）

`main` ブランチに変更をマージした後、以下のコマンドを実行します。

```bash
bash scripts/deploy.sh
```

以下の処理が自動で実行されます:

1. EC2 に SSH 接続
2. `git pull origin main` で最新コードを取得
3. `docker compose up -d --build` でイメージ再ビルド・コンテナ再起動
4. `rails db:migrate` で未適用マイグレーションを実行
5. ヘルスチェック（`GET /health`）で起動確認

## 環境変数一覧

EC2 上の `/app/.env` に以下の変数を設定します。このファイルは git 管理されないため、手動で作成・管理してください。

| 変数名 | 説明 | 例 |
|--------|------|----|
| `DATABASE_HOST` | RDS エンドポイント | `household-account-mysql.cr4kqywekj1c.ap-northeast-1.rds.amazonaws.com` |
| `DATABASE_PORT` | MySQL ポート | `3306` |
| `DATABASE_NAME` | DB 名 | `household_account_production` |
| `DATABASE_USERNAME` | RDS ユーザー名 | `admin` |
| `DATABASE_PASSWORD` | RDS パスワード | `terraform.tfvars` の `db_password` と同じ値 |
| `RAILS_ENV` | Rails 環境 | `production` |
| `RAILS_MASTER_KEY` | Rails 暗号化キー | `backend/config/master.key` の内容 |
| `SECRET_KEY_BASE` | セッション署名キー | `openssl rand -hex 64` で生成 |
| `DEVISE_JWT_SECRET_KEY` | JWT 署名キー | `openssl rand -hex 64` で生成 |
| `FRONTEND_URL` | フロントエンド URL（CORS 設定） | `http://18.179.100.96` |
| `NEXT_PUBLIC_API_BASE_URL` | フロントエンドから見た API URL | `http://18.179.100.96:3000` |
| `RAILS_LOG_TO_STDOUT` | ログを stdout に出力 | `true` |
| `RAILS_SERVE_STATIC_FILES` | 静的ファイル配信 | `true` |

## 初回セットアップ手順

インフラを新規構築する場合の手順です。

### 1. Terraform で AWS インフラを作成

```bash
# AWS 認証プロファイルを設定（事前に aws configure --profile household-account を実行済みであること）
$env:AWS_PROFILE = "household-account"

# 初回のみ: Terraform 状態管理用 S3・DynamoDB を作成
cd terraform/bootstrap
terraform init
terraform apply

# 本番インフラを作成
cd ../terraform
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars"

# EC2 IP と RDS エンドポイントを確認
terraform output
```

### 2. EC2 に SSH 接続して初期設定

```bash
ssh -i ~/.ssh/household-account ec2-user@<EC2_IP>
```

EC2 上で以下を実行します:

```bash
# リポジトリをクローン
git clone https://github.com/miyanoritallest-afk/HouseholdAccountBook.git /app
cd /app

# .env ファイルを作成（上記「環境変数一覧」を参照して値を設定）
vim .env
```

### 3. 初回デプロイ

```bash
# ローカルから実行
bash scripts/deploy.sh
```

初回は `db:migrate` で全テーブルが作成されます。

## EC2 への直接 SSH 接続

```bash
ssh -i ~/.ssh/household-account ec2-user@18.179.100.96
```

## よく使うコマンド（EC2 上）

```bash
cd /app

# コンテナの稼働状況を確認
docker compose -f docker-compose.prod.yml ps

# API のログを確認
docker compose -f docker-compose.prod.yml logs api

# フロントエンドのログを確認
docker compose -f docker-compose.prod.yml logs frontend

# Rails コンソールに接続
docker compose -f docker-compose.prod.yml --env-file .env exec api bundle exec rails console

# DB に直接接続（確認用）
docker run --rm -it mysql:8.0 mysql \
  -h <RDS_ENDPOINT> -u admin -p household_account_production

# コンテナを停止
docker compose -f docker-compose.prod.yml down

# コンテナを再起動（ビルドなし）
docker compose -f docker-compose.prod.yml --env-file .env up -d
```

## トラブルシューティング

### API コンテナが起動しない

```bash
# ログを確認
docker compose -f docker-compose.prod.yml logs api

# よくある原因:
# - .env の DATABASE_HOST が間違っている
# - RAILS_MASTER_KEY が設定されていない
# - RDS がまだ起動していない（terraform apply 直後）
```

### フロントエンドが表示されない

```bash
docker compose -f docker-compose.prod.yml logs frontend

# よくある原因:
# - NEXT_PUBLIC_API_BASE_URL が間違っている（ビルド時の引数のため再ビルドが必要）
```

### RDS に接続できない

EC2 から以下で疎通確認:

```bash
# EC2 上で実行
nc -zv <RDS_ENDPOINT> 3306
```

接続できない場合は RDS セキュリティグループで EC2 の SG が許可されているか確認してください。
