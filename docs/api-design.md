# API 設計

[← 要件定義書に戻る](./requirements.md)

---

## 共通仕様

| 項目 | 内容 |
|------|------|
| ベース URL | `/api/v1` |
| リクエスト形式 | `Content-Type: application/json` |
| レスポンス形式 | JSON |
| 認証方式 | JWT トークン（Authorization ヘッダー） |

### 共通エラーレスポンス

| ステータスコード | 意味 |
|----------------|------|
| 400 | バリデーションエラー（入力値不正） |
| 401 | 未認証（ログイン必要） |
| 403 | アクセス権限なし |
| 404 | リソースが見つからない |
| 500 | サーバーエラー |

---

## 1. 認証 API

### POST /api/v1/auth/signup　ユーザー登録

**リクエスト**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス（201）**
```json
{
  "token": "eyJ...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

---

### POST /api/v1/auth/login　ログイン

**リクエスト**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス（200）**
```json
{
  "token": "eyJ...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

---

### DELETE /api/v1/auth/logout　ログアウト

**レスポンス（200）**
```json
{
  "message": "ログアウトしました"
}
```

---

## 2. 収支 API

### GET /api/v1/transactions　収支一覧取得

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| year | integer | NO | 取得年（例: 2026） |
| month | integer | NO | 取得月（例: 5） |

**レスポンス（200）**
```json
{
  "transactions": [
    {
      "id": 1,
      "transaction_type": "expense",
      "amount": 1200,
      "category": { "id": 1, "name": "食費" },
      "date": "2026-05-08",
      "memo": "ランチ"
    }
  ],
  "summary": {
    "income_total": 200000,
    "expense_total": 85000,
    "balance": 115000
  }
}
```

---

### POST /api/v1/transactions　収支登録

**リクエスト**
```json
{
  "transaction_type": "expense",
  "amount": 1200,
  "category_id": 1,
  "date": "2026-05-08",
  "memo": "ランチ"
}
```

**レスポンス（201）**
```json
{
  "id": 1,
  "transaction_type": "expense",
  "amount": 1200,
  "category": { "id": 1, "name": "食費" },
  "date": "2026-05-08",
  "memo": "ランチ"
}
```

---

### PUT /api/v1/transactions/:id　収支更新

**リクエスト**
```json
{
  "transaction_type": "expense",
  "amount": 1500,
  "category_id": 1,
  "date": "2026-05-08",
  "memo": "ランチ（修正）"
}
```

**レスポンス（200）**: 更新後の収支オブジェクト

---

### DELETE /api/v1/transactions/:id　収支削除

**レスポンス（200）**
```json
{
  "message": "削除しました"
}
```

---

## 3. カテゴリ API

### GET /api/v1/categories　カテゴリ一覧取得

**レスポンス（200）**
```json
{
  "income": [
    { "id": 10, "name": "給与" },
    { "id": 11, "name": "副業" }
  ],
  "expense": [
    { "id": 1, "name": "食費" },
    { "id": 2, "name": "交通費" }
  ]
}
```

---

### POST /api/v1/categories　カテゴリ登録

**リクエスト**
```json
{
  "name": "書籍",
  "category_type": "expense"
}
```

**レスポンス（201）**
```json
{
  "id": 20,
  "name": "書籍",
  "category_type": "expense"
}
```

---

### PUT /api/v1/categories/:id　カテゴリ更新

**リクエスト**
```json
{
  "name": "本・雑誌"
}
```

**レスポンス（200）**: 更新後のカテゴリオブジェクト

---

### DELETE /api/v1/categories/:id　カテゴリ削除

**レスポンス（200）**
```json
{
  "message": "削除しました"
}
```

**エラー（400）**: 収支データが紐づいている場合
```json
{
  "error": "このカテゴリには収支データが紐づいているため削除できません"
}
```

---

## 4. レポート API

### GET /api/v1/reports/monthly　月次集計取得

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| year | integer | YES | 対象年 |
| month | integer | YES | 対象月 |

**レスポンス（200）**
```json
{
  "year": 2026,
  "month": 5,
  "income_total": 200000,
  "expense_total": 85000,
  "balance": 115000
}
```

---

### GET /api/v1/reports/category_summary　カテゴリ別支出集計取得

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| year | integer | YES | 対象年 |
| month | integer | YES | 対象月 |

**レスポンス（200）**
```json
{
  "year": 2026,
  "month": 5,
  "categories": [
    { "name": "食費", "amount": 38000, "percentage": 45 },
    { "name": "交通費", "amount": 12750, "percentage": 15 },
    { "name": "娯楽費", "amount": 17000, "percentage": 20 },
    { "name": "その他", "amount": 17250, "percentage": 20 }
  ]
}
```
