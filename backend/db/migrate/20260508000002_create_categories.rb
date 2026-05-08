class CreateCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :categories do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.string :name,          null: false, limit: 20
      t.string :category_type, null: false
      t.timestamps
    end
  end
end
