variable "aws_region" {
  type    = string
  default = "ap-northeast-1"
}

variable "ssh_public_key" {
  type        = string
  description = "EC2にSSHログインするための公開鍵（~/.ssh/household-account.pub の内容）"
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "SSHを許可するIPアドレス（自分のIPを xx.xx.xx.xx/32 の形式で指定）"
}
