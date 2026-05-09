class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :categories, dependent: :destroy
  has_many :transactions, dependent: :destroy

  after_create :create_default_categories

  private

  DEFAULT_CATEGORIES = {
    expense: %w[食費 交通費 娯楽費 日用品 医療費 光熱費 通信費 その他],
    income: %w[給与 副業 その他]
  }.freeze

  def create_default_categories
    DEFAULT_CATEGORIES.each do |type, names|
      names.each do |name|
        categories.create!(name: name, category_type: type.to_s)
      end
    end
  end
end
