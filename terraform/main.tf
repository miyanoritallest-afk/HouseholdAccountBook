terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "household-account-terraform-state-074610726755"
    key            = "production/terraform.tfstate"
    region         = "ap-northeast-1"
    use_lockfile   = true
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = "HouseholdAccountBook"
      ManagedBy = "Terraform"
    }
  }
}

# ---------------------------------------------------------------------------
# データソース
# ---------------------------------------------------------------------------

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ---------------------------------------------------------------------------
# ネットワーク（VPC・サブネット・IGW）
# ---------------------------------------------------------------------------

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "household-account-vpc" }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = { Name = "household-account-igw" }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = { Name = "household-account-public-subnet" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "household-account-public-rt" }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# ---------------------------------------------------------------------------
# セキュリティグループ
# ---------------------------------------------------------------------------

resource "aws_security_group" "ec2" {
  name        = "household-account-ec2-sg"
  description = "EC2 instance security group"
  vpc_id      = aws_vpc.main.id

  # SSH（デプロイ・メンテナンス用）
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
    description = "SSH access"
  }

  # フロントエンド（Next.js）
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP frontend"
  }

  # バックエンド（Rails API）— フロントエンドから参照されるため公開
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Rails API"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "household-account-ec2-sg" }
}

# ---------------------------------------------------------------------------
# EC2キーペア（SSHログイン用）
# ---------------------------------------------------------------------------

resource "aws_key_pair" "main" {
  key_name   = "household-account-key"
  public_key = var.ssh_public_key

  tags = { Name = "household-account-key" }
}

# ---------------------------------------------------------------------------
# Elastic IP（固定IPアドレス）
# ---------------------------------------------------------------------------

resource "aws_eip" "main" {
  domain   = "vpc"
  instance = aws_instance.main.id

  tags = { Name = "household-account-eip" }
}

# ---------------------------------------------------------------------------
# EC2インスタンス（t2.micro = 1年間無料枠）
# ---------------------------------------------------------------------------

resource "aws_instance" "main" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  key_name               = aws_key_pair.main.key_name

  root_block_device {
    volume_type = "gp3"
    volume_size = 20  # 無料枠は30GBまで
  }

  # 起動時にDockerとDocker Composeをインストール
  user_data = <<-EOF
    #!/bin/bash
    set -e

    # システム更新
    dnf update -y

    # Dockerインストール
    dnf install -y docker git
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ec2-user

    # Docker Compose v2インストール
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
      -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

    # アプリ用ディレクトリ作成
    mkdir -p /app
    chown ec2-user:ec2-user /app
  EOF

  tags = { Name = "household-account-ec2" }
}

# ---------------------------------------------------------------------------
# 出力
# ---------------------------------------------------------------------------

output "instance_public_ip" {
  description = "EC2インスタンスの固定IPアドレス（デプロイ・アクセスに使用）"
  value       = aws_eip.main.public_ip
}

output "app_url" {
  description = "アプリへのアクセスURL"
  value       = "http://${aws_eip.main.public_ip}"
}

output "ssh_command" {
  description = "SSHログインコマンド"
  value       = "ssh -i ~/.ssh/household-account ec2-user@${aws_eip.main.public_ip}"
}
