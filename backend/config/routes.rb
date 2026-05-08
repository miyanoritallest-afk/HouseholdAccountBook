Rails.application.routes.draw do
  get "/health", to: proc { [200, { "Content-Type" => "application/json" }, ['{"status":"ok","message":"Rails API is running"}']] }

  namespace :api do
    namespace :v1 do
      devise_for :users,
        path: "auth",
        path_names: {
          sign_in: "login",
          sign_out: "logout",
          registration: "signup"
        },
        controllers: {
          sessions: "api/v1/auth/sessions",
          registrations: "api/v1/auth/registrations"
        },
        singular: :user

      resources :transactions
      resources :categories

      namespace :reports do
        get :monthly,          to: "monthly#show"
        get :category_summary, to: "category_summary#show"
      end
    end
  end
end
