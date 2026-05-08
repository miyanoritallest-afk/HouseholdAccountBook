require "rails_helper"

RSpec.describe "Api::V1::Transactions", type: :request do
  pending "GET    /api/v1/transactions - 正常系: 月別一覧と集計が返る"
  pending "POST   /api/v1/transactions - 正常系: 収支を登録できる"
  pending "PUT    /api/v1/transactions/:id - 正常系: 収支を更新できる"
  pending "DELETE /api/v1/transactions/:id - 正常系: 収支を削除できる"
  pending "GET    /api/v1/transactions - 異常系: 未認証は 401"
  pending "DELETE /api/v1/transactions/:id - 異常系: 他ユーザーのデータは 404"
end
