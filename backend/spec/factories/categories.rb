FactoryBot.define do
  factory :category do
    association :user
    sequence(:name) { |n| "カテゴリ#{n}" }
    category_type { "expense" }
  end
end
