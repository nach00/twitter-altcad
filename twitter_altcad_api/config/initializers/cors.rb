# twitter_altcad_api/config/initializers/cors.rb

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Determine allowed origins:
    # 1. From environment variable `CORS_ALLOWED_ORIGINS` (comma-separated for multiple origins).
    # 2. Defaults to 'http://localhost:3000' if ENV var is not set (common for local Next.js dev).
    #    Adjust this default port if your local frontend runs on a different port (e.g., 8000, 3001).
    #    The .map(&:strip) removes any leading/trailing whitespace from each origin.
    allowed_origins = ENV.fetch("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
                         .split(",")
                         .map(&:strip)
                         .reject(&:blank?) # Remove any blank origins that might result from trailing commas

    origins allowed_origins

    resource "*", # Applies to all API resources/endpoints
             headers: :any, # Allows any headers in the request (e.g., 'Content-Type', 'Authorization')
             methods: [ :get, :post, :put, :patch, :delete, :options, :head ], # Allowed HTTP methods
             credentials: true, # Allows cookies or Authorization headers to be sent cross-origin.
             # When true, 'origins' CANNOT be a wildcard '*' and must be specific.
             # If your frontend JavaScript needs to read specific custom headers from the API response,
             # list them in 'expose'. This is common for some token-based authentication schemes.
             # Adjust this list based on the actual headers your frontend needs to access.
             expose: [ "access-token", "expiry", "token-type", "uid", "client", "Authorization" ] # Added 'Authorization' as it's common
  end
end
