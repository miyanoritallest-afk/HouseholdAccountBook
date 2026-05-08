class CreateTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :transactions do |t|
      t.references :user,     null: false, foreign_key: { on_delete: :cascade }
      t.references :category, null: false, foreign_key: { on_delete: :restrict }
      t.string  :transaction_type, null: false
      t.integer :amount,           null: false
      t.date    :date,             null: false
      t.string  :memo,             limit: 200
      t.timestamps
    end

    add_index :transactions, [:user_id, :date]
  end
end
