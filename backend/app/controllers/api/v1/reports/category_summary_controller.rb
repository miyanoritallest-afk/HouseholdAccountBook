module Api
  module V1
    module Reports
      class CategorySummaryController < BaseController
        def show
          year, month = parse_year_month
          range = Date.new(year, month).beginning_of_month..Date.new(year, month).end_of_month

          amounts_by_category = current_user.transactions
            .expense
            .where(date: range)
            .group(:category_id)
            .sum(:amount)

          expense_total = amounts_by_category.values.sum

          category_map = current_user.categories
            .where(id: amounts_by_category.keys)
            .index_by(&:id)

          categories = amounts_by_category.filter_map do |category_id, amount|
            category = category_map[category_id]
            next unless category
            percentage = expense_total > 0 ? (amount.to_f / expense_total * 100).round : 0
            { name: category.name, amount: amount, percentage: percentage }
          end

          render json: { year: year, month: month, categories: categories }
        end
      end
    end
  end
end
