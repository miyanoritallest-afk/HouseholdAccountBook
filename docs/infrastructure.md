# インフラ構成

## アーキテクチャ概要

```
Internet
    |
    | HTTP :80 / API :3000
    |
+---+----------------------------------+
|   EC2 (t3.micro)  18.179.100.96      |
|                                      |
|  +----------------+                  |
|  | frontend       | :80  Next.js     |
|  +----------------+                  |
|  | api            | :3000 Rails      |
|  +----------------+                  |
|                                      |
+---+----------------------------------+
    |
    | MySQL :3306 (VPC 内部のみ)
    |
+---+----------------------------------+
|   RDS MySQL 8.0 (db.t3.micro)        |
|   household-account-mysql            |
|   .cr4kqywekj1c.ap-northeast-1      |
|   .rds.amazonaws.com                 |
+--------------------------------------+
```

## AWS リソース一覧

| リソース | 識別子 / 値 | 備考 |
|---------|------------|------|
| リージョン | ap-northeast-1（東京） | |
| VPC | 10.0.0.0/16 | |
| パブリックサブネット | 10.0.1.0/24（ap-northeast-1a） | EC2 配置 |
| DB サブネット A | 10.0.10.0/24（ap-northeast-1a） | RDS 用 |
| DB サブネット C | 10.0.11.0/24（ap-northeast-1c） | RDS 用（Multi-AZ 要件） |
| EC2 インスタンス | t3.micro / Amazon Linux 2023 | 無料枠対象 |
| Elastic IP | 18.179.100.96 | 固定 IP |
| RDS | db.t3.micro / MySQL 8.0 / 20GB gp2 | 無料枠対象 |
| EC2 セキュリティグループ | household-account-ec2-sg | SSH・HTTP・API を許可 |
| RDS セキュリティグループ | household-account-rds-sg | EC2 SG からのみ 3306 を許可 |
| Terraform 状態 S3 バケット | household-account-terraform-state-074610726755 | 暗号化・ロック有効 |

## セキュリティグループ設定

### EC2 セキュリティグループ

| 方向 | プロトコル | ポート | 送信元 | 用途 |
|------|-----------|--------|--------|------|
| Inbound | TCP | 22 | 管理者 IP /32 | SSH |
| Inbound | TCP | 80 | 0.0.0.0/0 | フロントエンド（HTTP） |
| Inbound | TCP | 3000 | 0.0.0.0/0 | Rails API |
| Outbound | ALL | ALL | 0.0.0.0/0 | すべての外向き通信 |

### RDS セキュリティグループ

| 方向 | プロトコル | ポート | 送信元 | 用途 |
|------|-----------|--------|--------|------|
| Inbound | TCP | 3306 | EC2 セキュリティグループ | MySQL（EC2 からのみ） |

インターネットや外部 IP からの 3306 ポートへの接続は不可です。

## EC2 上のアプリ構成

EC2 上では Docker Compose を使って2つのコンテナが稼働しています。

```
/app/
├── docker-compose.prod.yml   # コンテナ定義（git 管理）
├── .env                      # 本番シークレット（git 管理外・手動配置）
├── backend/                  # Rails API ソース
└── frontend/                 # Next.js ソース
```

| コンテナ | イメージ | ポート | 役割 |
|---------|---------|--------|------|
| app-api-1 | ./backend/Dockerfile | 3000 | Rails API |
| app-frontend-1 | ./frontend/Dockerfile | 80→3001 | Next.js |

## Terraform 管理

インフラは `terraform/` ディレクトリで Terraform により管理されています。

### ファイル構成

```
terraform/
├── bootstrap/
│   └── main.tf               # S3 バケット・DynamoDB（状態管理）初回のみ実行
├── main.tf                   # メインインフラ定義
├── variables.tf              # 変数定義
├── terraform.tfvars          # 実際の値（.gitignore 対象・手動作成）
└── terraform.tfvars.example  # terraform.tfvars のテンプレート
```

### Terraform 操作コマンド

```bash
# AWS プロファイルを設定
$env:AWS_PROFILE = "household-account"   # PowerShell
export AWS_PROFILE="household-account"   # Bash

# 初期化（初回のみ）
cd terraform
terraform init

# 変更内容の確認
terraform plan -var-file="terraform.tfvars"

# 変更の適用
terraform apply -var-file="terraform.tfvars"

# 出力値の確認（EC2 IP・RDS エンドポイント等）
terraform output
```

### terraform.tfvars の作成

`terraform/terraform.tfvars.example` をコピーして値を設定してください。このファイルは `.gitignore` により git 管理されません。

```bash
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# エディタで各値を設定
```

## コスト概算

| リソース | 種別 | 月額概算 |
|---------|------|---------|
| EC2 t3.micro | 無料枠（750時間/月） | $0（1年間） |
| RDS db.t3.micro | 無料枠（750時間/月） | $0（1年間） |
| EBS 20GB | 無料枠（30GB/月まで） | $0（1年間） |
| RDS ストレージ 20GB | 無料枠（20GB/月まで） | $0（1年間） |
| Elastic IP | EC2 に紐付け中は無料 | $0 |
| S3（Terraform 状態） | 数KB 程度 | ~$0 |
| **合計** | | **~$0（無料枠内）** |

無料枠期限（12か月）終了後の概算: EC2 ~$8/月 + RDS ~$18/月 = **~$26/月**
