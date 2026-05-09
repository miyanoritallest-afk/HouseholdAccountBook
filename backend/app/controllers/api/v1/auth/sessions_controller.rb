module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          render json: {
            token: request.env["warden-jwt_auth.token"],
            user: { id: resource.id, email: resource.email }
          }, status: :ok
        end

        def respond_to_on_destroy
          render json: { message: "ログアウトしました" }, status: :ok
        end
      end
    end
  end
end
