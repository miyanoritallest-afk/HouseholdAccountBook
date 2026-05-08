module Api
  module V1
    class TransactionsController < BaseController
      before_action :set_transaction, only: [:show, :update, :destroy]

      def index
        year  = params[:year]&.to_i  || Date.current.year
        month = params[:month]&.to_i || Date.current.month

        transactions = current_user.transactions
          .includes(:category)
          .where(date: Date.new(year, month).beginning_of_month..Date.new(year, month).end_of_month)
          .order(date: :desc)

        income_total  = transactions.income.sum(:amount)
        expense_total = transactions.expense.sum(:amount)

        render json: {
          transactions: transactions.map { |t| transaction_json(t) },
          summary: {
            income_total: income_total,
            expense_total: expense_total,
            balance: income_total - expense_total
          }
        }
      end

      def show
        render json: transaction_json(@transaction)
      end

      def create
        transaction = current_user.transactions.build(transaction_params)
        if transaction.save
          render json: transaction_json(transaction), status: :created
        else
          render json: { errors: transaction.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @transaction.update(transaction_params)
          render json: transaction_json(@transaction)
        else
          render json: { errors: @transaction.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @transaction.destroy
        render json: { message: "削除しました" }
      end

      private

      def set_transaction
        @transaction = current_user.transactions.find(params[:id])
      end

      def transaction_params
        params.require(:transaction).permit(:transaction_type, :amount, :category_id, :date, :memo)
      end

      def transaction_json(t)
        {
          id: t.id,
          transaction_type: t.transaction_type,
          amount: t.amount,
          category: { id: t.category.id, name: t.category.name },
          date: t.date,
          memo: t.memo
        }
      end
    end
  end
end
