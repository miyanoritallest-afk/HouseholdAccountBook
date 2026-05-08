class Category < ApplicationRecord
  belongs_to :user
  has_many :transactions, dependent: :restrict_with_error

  enum :category_type, { income: "income", expense: "expense" }

  validates :name, presence: true, length: { maximum: 20 }
  validates :category_type, presence: true
end
