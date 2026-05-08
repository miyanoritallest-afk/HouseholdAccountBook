# データベース設計

[← 要件定義書に戻る](./requirements.md)

---

## 1. テーブル一覧

| テーブル名 | 説明 |
|-----------|------|
| users | ユーザー情報 |
| categories | 収支カテゴリ |
| transactions | 収支データ |

---

## 2. ER 図

```
users
  │
  ├──< categories  (user_id)
  │
  └──< transactions (user_id)
            │
            └──> categories (category_id)
```

---

## 3. テーブル定義

### users テーブル

| カラム名 | 型 | NULL | 制約 | 説明 |
|----------|----|------|------|------|
| id | BIGINT | NO | PRIMARY KEY, AUTO_INCREMENT | 主キー |
| email | VARCHAR(255) | NO | UNIQUE | メールアドレス |
| password_digest | VARCHAR(255) | NO | | ハッシュ化パスワード |
| created_at | DATETIME | NO | | 作成日時 |
| updated_at | DATETIME | NO | | 更新日時 |

### categories テーブル

| カラム名 | 型 | NULL | 制約 | 説明 |
|----------|----|------|------|------|
| id | BIGINT | NO | PRIMARY KEY, AUTO_INCREMENT | 主キー |
| user_id | BIGINT | NO | FOREIGN KEY → users.id | ユーザーID |
| name | VARCHAR(20) | NO | | カテゴリ名 |
| category_type | ENUM('income','expense') | NO | | 種別（収入／支出） |
| created_at | DATETIME | NO | | 作成日時 |
| updated_at | DATETIME | NO | | 更新日時 |

### transactions テーブル

| カラム名 | 型 | NULL | 制約 | 説明 |
|----------|----|------|------|------|
| id | BIGINT | NO | PRIMARY KEY, AUTO_INCREMENT | 主キー |
| user_id | BIGINT | NO | FOREIGN KEY → users.id | ユーザーID |
| category_id | BIGINT | NO | FOREIGN KEY → categories.id | カテゴリID |
| transaction_type | ENUM('income','expense') | NO | | 種別（収入／支出） |
| amount | DECIMAL(9,0) | NO | CHECK (amount >= 1) | 金額（1〜999,999,999円） |
| date | DATE | NO | | 日付 |
| memo | VARCHAR(200) | YES | | メモ（任意） |
| created_at | DATETIME | NO | | 作成日時 |
| updated_at | DATETIME | NO | | 更新日時 |

---

## 4. 制約・備考

- `categories.user_id` は `users.id` への外部キー制約あり（CASCADE DELETE）
- `transactions.user_id` は `users.id` への外部キー制約あり（CASCADE DELETE）
- `transactions.category_id` は `categories.id` への外部キー制約あり（RESTRICT）  
  → カテゴリに収支が紐づいている場合は削除不可
- カテゴリはユーザーごとに管理されるため、デフォルトカテゴリはユーザー登録時に自動生成する
