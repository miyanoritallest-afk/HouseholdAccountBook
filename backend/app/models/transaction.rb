class Transaction < ApplicationRecord
  belongs_to :user
  belongs_to :category

  enum :transaction_type, { income: "income", expense: "expense" }

  validates :transaction_type, presence: true
  validates :amount, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 999_999_999 }
  validates :date, presence: true
  validates :memo, length: { maximum: 200 }, allow_nil: true

  validate :category_belongs_to_user

  private

  def category_belongs_to_user
    return unless category && user
    errors.add(:category, "はこのユーザーのカテゴリではありません") unless category.user_id == user_id
  end
end
