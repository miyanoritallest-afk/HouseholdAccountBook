module Api
  module V1
    module Reports
      class MonthlyController < BaseController
        def show
          year, month = parse_year_month
          range = Date.new(year, month).beginning_of_month..Date.new(year, month).end_of_month

          transactions = current_user.transactions.where(date: range)
          income_total  = transactions.income.sum(:amount)
          expense_total = transactions.expense.sum(:amount)

          render json: {
            year: year,
            month: month,
            income_total: income_total,
            expense_total: expense_total,
            balance: income_total - expense_total
          }
        end
      end
    end
  end
end
