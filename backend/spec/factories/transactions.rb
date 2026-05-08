FactoryBot.define do
  factory :transaction do
    association :user
    association :category
    transaction_type { "expense" }
    amount { 1000 }
    date { Date.current }
    memo { nil }
  end
end
