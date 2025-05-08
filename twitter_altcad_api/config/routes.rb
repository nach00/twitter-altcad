# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [ :create ] # For signup: POST /api/v1/users
      # post "/login", to: "auth#create"     # For login: POST /api/v1/login
      post "/login", to: "authentication#login"
      post "/signup", to: "authentication#signup"
      # get '/profile', to: 'auth#profile' # Optional: to verify token and get user data
      # Define other resources for your application (tweets, etc.)
      # e.g., resources :tweets, only: [:index, :create, :show, :destroy]
    end
  end
end
