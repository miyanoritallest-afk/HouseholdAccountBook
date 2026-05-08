require "rails_helper"

RSpec.describe "Api::V1::Auth", type: :request do
  pending "POST /api/v1/auth/signup - 正常系: ユーザー登録できる"
  pending "POST /api/v1/auth/signup - 異常系: メールアドレス重複"
  pending "POST /api/v1/auth/login  - 正常系: JWT トークンが返る"
  pending "POST /api/v1/auth/login  - 異常系: パスワード不一致"
  pending "DELETE /api/v1/auth/logout - 正常系: ログアウトできる"
end
