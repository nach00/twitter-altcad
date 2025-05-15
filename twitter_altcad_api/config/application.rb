# twitter_altcad_api/config/application.rb
require_relative "boot"

require "rails/all" # Or specific railties you need if it's an API-only app

# Require the gems listed in Gemfile, including any gems
# you've added manually.
Bundler.require(*Rails.groups)

module TwitterAltcadApi
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults Rails::VERSION::STRING.to_f # Adjust if using an older Rails version syntax

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = false # Important if this is an API-only Rails app

    # JWT Secret Key Configuration
    # Use an environment variable in production, fallback for dev/test.
    # Ensure JWT_SECRET_KEY is set in Heroku Config Vars.
    config.jwt_secret_key = ENV.fetch("JWT_SECRET_KEY") {
      if Rails.env.production?
        raise "JWT_SECRET_KEY environment variable must be set in production!"
      else
        # For development/test, you can use a default or Rails' secret_key_base
        Rails.application.credentials.secret_key_base || SecureRandom.hex(64)
      end
    }

    # If you need session middleware for other parts (e.g., admin interface)
    # config.middleware.use ActionDispatch::Cookies
    # config.middleware.use ActionDispatch::Session::CookieStore, key: '_your_app_session'
    # config.middleware.use ActionDispatch::Flash
  end
end
