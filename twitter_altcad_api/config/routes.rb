# ~/github/twitter-altcad/twitter_altcad_api/config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # --- Authentication ---
      # Signup creates a new user resource
      post "/signup", to: "users#create"
      # Login authenticates an existing user
      post "/login",  to: "authentication#login"
      # delete '/logout', to: 'authentication#logout' # Optional: for server-side token invalidation

      # --- User Management ---
      # :index to list users (e.g., for search, admin)
      # :show to fetch a specific user's profile (e.g., GET /api/v1/users/:id)
      resources :users, only: [ :index, :show ] # :create is handled by /signup

      # --- Other API Resources ---

      resources :tweets, only: [ :index, :create, :show, :destroy ]
      resources :likes, only: [ :create, :destroy ]
      resources :bookmarks, only: [ :create, :destroy ]
      resources :follows, only: [ :create, :destroy ]

      # Health check
      get "/health", to: "application#health"
    end
  end

  # If Rails serves the Next.js frontend, this catch-all should be LAST.
  # It ensures non-API GET requests that are HTML are routed to your frontend.
  get "*path", to: "application#serve_frontend", constraints: lambda { |req|
    !req.xhr? && req.format.html?
  }
  # You might also want a root path if your Next.js app is served from root.
  # root to: 'application#serve_frontend'
end
