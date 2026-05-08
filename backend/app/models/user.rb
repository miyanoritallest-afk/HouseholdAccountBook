class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :categories, dependent: :destroy
  has_many :transactions, dependent: :destroy

  after_create :create_default_categories

  private

  DEFAULT_CATEGORIES = {
    expense: %w[食費 日用品 交通費 娯楽費 医療費 衣服費 交際費 その他支出],
    income: %w[給与 副収入 その他収入]
  }.freeze

  def create_default_categories
    DEFAULT_CATEGORIES.each do |type, names|
      names.each do |name|
        categories.create!(name: name, category_type: type.to_s)
      end
    end
  end
end
