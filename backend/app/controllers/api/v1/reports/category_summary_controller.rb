module Api
  module V1
    module Reports
      class CategorySummaryController < BaseController
        def show
          year  = params[:year]&.to_i  || Date.current.year
          month = params[:month]&.to_i || Date.current.month
          range = Date.new(year, month).beginning_of_month..Date.new(year, month).end_of_month

          amounts_by_category = current_user.transactions
            .expense
            .includes(:category)
            .where(date: range)
            .group(:category_id)
            .sum(:amount)

          expense_total = amounts_by_category.values.sum

          categories = amounts_by_category.map do |category_id, amount|
            category = Category.find(category_id)
            percentage = expense_total > 0 ? (amount.to_f / expense_total * 100).round : 0
            { name: category.name, amount: amount, percentage: percentage }
          end

          render json: { year: year, month: month, categories: categories }
        end
      end
    end
  end
end
