Devise.setup do |config|
  config.mailer_sender = "no-reply@example.com"
  config.navigational_formats = []
  require "devise/orm/active_record"
  config.authentication_keys = [:email]
  config.params_authenticatable = true

  config.jwt do |jwt|
    jwt.secret = ENV.fetch("DEVISE_JWT_SECRET_KEY")
    jwt.dispatch_requests = [
      ["POST", %r{^/api/v1/auth/login$}]
    ]
    jwt.revocation_requests = [
      ["DELETE", %r{^/api/v1/auth/logout$}]
    ]
    jwt.expiration_time = 24.hours.to_i
  end
end
