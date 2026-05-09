class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActionController::ParameterMissing, with: :bad_request
  rescue_from ArgumentError, with: :bad_request

  private

  def not_found
    render json: { error: "リソースが見つかりません" }, status: :not_found
  end

  def bad_request(e)
    render json: { error: e.message }, status: :bad_request
  end

  def parse_year_month
    year  = params[:year]&.to_i  || Date.current.year
    month = params[:month]&.to_i || Date.current.month
    raise ArgumentError, "無効な年月です" unless year.between?(1, 9999) && month.between?(1, 12)
    [ year, month ]
  end
end
