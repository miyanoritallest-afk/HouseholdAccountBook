if Rails.env.development?
  user = User.find_or_create_by!(email: "demo@example.com") do |u|
    u.password = "password123"
  end
  puts "デモユーザー作成: #{user.email}"
  puts "デフォルトカテゴリは User#after_create で自動生成されます"
end
