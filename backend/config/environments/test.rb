require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = false
  config.consider_all_requests_local = true
  config.action_mailer.delivery_method = :test
  config.active_support.deprecation = :stderr
  config.active_record.dump_schema_after_migration = false
end
