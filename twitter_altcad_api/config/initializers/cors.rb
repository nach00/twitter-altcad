# twitter_altcad_api/config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Fetch allowed origins from an environment variable.
    # Default to 'http://localhost:8000' for local development if the ENV var isn't set.
    # You might use a different port for your local Next.js dev server (e.g., 3000, 3001).
    # The .split(',').map(&:strip) allows for multiple comma-separated origins.
    origins ENV.fetch("CORS_ALLOWED_ORIGINS", "http://localhost:8000").split(",").map(&:strip)

    resource "*", # Allow all resources (API endpoints)
      headers: :any, # Allow any headers in the request
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ], # Allowed HTTP methods
      credentials: true, # IMPORTANT: Allow cookies or authorization headers to be sent.
      # If true, 'origins' cannot be a wildcard '*' and must be specific.
      # If your frontend JavaScript needs to read custom headers from the API response,
      # list them in 'expose'. Common for token-based authentication.
      expose: [ "access-token", "expiry", "token-type", "uid", "client" ] # Adjust as per your auth setup
  end
end
