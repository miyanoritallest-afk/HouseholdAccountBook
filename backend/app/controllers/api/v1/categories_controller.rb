module Api
  module V1
    class CategoriesController < BaseController
      before_action :set_category, only: [:update, :destroy]

      def index
        grouped = current_user.categories.order(:category_type, :id).group_by(&:category_type)
        render json: {
          expense: (grouped["expense"] || []).map { |c| { id: c.id, name: c.name } },
          income:  (grouped["income"]  || []).map { |c| { id: c.id, name: c.name } },
        }
      end

      def create
        category = current_user.categories.build(category_params)
        if category.save
          render json: { id: category.id, name: category.name, category_type: category.category_type }, status: :created
        else
          render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @category.update(category_params)
          render json: { id: @category.id, name: @category.name, category_type: @category.category_type }
        else
          render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @category.destroy
          render json: { message: "削除しました" }
        else
          render json: { errors: @category.errors.full_messages }, status: :bad_request
        end
      end

      private

      def set_category
        @category = current_user.categories.find(params[:id])
      end

      def category_params
        params.require(:category).permit(:name, :category_type)
      end
    end
  end
end
