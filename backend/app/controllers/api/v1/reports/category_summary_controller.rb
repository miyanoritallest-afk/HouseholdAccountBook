module Api
  module V1
    module Reports
      class CategorySummaryController < BaseController
        def show
          year  = params[:year]&.to_i  || Date.current.year
          month = params[:month]&.to_i || Date.current.month
          range = Date.new(year, month).beginning_of_month..Date.new(year, month).end_of_month

          summary = current_user.transactions
            .expense
            .includes(:category)
            .where(date: range)
            .group(:category_id)
            .sum(:amount)
            .map do |category_id, total|
              category = Category.find(category_id)
              { category_id: category_id, category_name: category.name, total: total }
            end

          render json: { year: year, month: month, category_summary: summary }
        end
      end
    end
  end
end
