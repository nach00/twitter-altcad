# ~/github/twitter-altcad/twitter_altcad_api/config/routes.rb

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Authentication Routes
      # Assuming you have an AuthenticationController for these actions
      # The `signup` route typically creates a user, so it can point to UsersController#create
      # The `login` route validates credentials and creates a session/token.
      post "/signup", to: "users#create"        # Maps to POST /api/v1/signup -> UsersController#create
      post "/login", to: "authentication#login" # Maps to POST /api/v1/login -> AuthenticationController#login
      # delete '/logout', to: 'authentication#logout' # Optional: If you have a server-side logout for token invalidation

      # User Resources
      # :create is handled by /signup.
      # If you need to fetch a specific user (e.g., by ID or username for profiles) or list users:
      resources :users, only: [ :index, :show ] do
        # Example for nested routes if needed, e.g., a user's tweets
        # resources :tweets, only: [:index], controller: 'users/tweets'
      end

      # Tweet Resources
      resources :tweets, only: [ :index, :create, :show, :destroy ] # Added :show

      # Other Social Interaction Resources
      resources :likes, only: [ :create, :destroy ]
      resources :bookmarks, only: [ :create, :destroy ]
      resources :follows, only: [ :create, :destroy ] # For following/unfollowing users

      # Sessions Resource (if you're using it distinctly for session management beyond login/logout)
      # The `post '/login'` above likely handles session creation.
      # `delete '/logout'` could handle session destruction.
      # If `resources :sessions` is for something else, keep it, otherwise it might be redundant.
      # For JWT-based auth, explicit session resources are often not needed beyond login/logout endpoints.
      # resources :sessions, only: [:create, :destroy] # Review if this is truly needed

      # Health Check (good practice)
      get "/health", to: "application#health"
    end
  end

  # If Rails is also serving your Next.js frontend (single app deployment):
  # This catch-all route should be LAST.
  # It directs non-API, HTML requests to a Rails controller action
  # that serves the main index.html of your Next.js app.
  # get '*path', to: 'frontend#index', constraints: lambda { |req|
  #  !req.xhr? && req.format.html?
  # }
  # root to: 'frontend#index' # If Next.js app is at the root
end
