module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        private

        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation)
        end

        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: {
              token: request.env["warden-jwt_auth.token"],
              user: { id: resource.id, email: resource.email }
            }, status: :created
          else
            render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
