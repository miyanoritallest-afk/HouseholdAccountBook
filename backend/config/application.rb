require_relative "boot"
require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"

Bundler.require(*Rails.groups)

module HouseholdAccount
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = true
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore, key: "_session"
    config.time_zone = "Tokyo"
    config.i18n.default_locale = :ja
  end
end
