# twitter_altcad_api/app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  # If you have JWT authentication, ensure it's set up.
  # This assumes you have a method to encode_token and related auth logic.
  # If not using JWT immediately, you can comment out before_action :authorized
  # for initial testing of routes.
  before_action :authorized

  def encode_token(payload)
    # Ensure JWT_SECRET_KEY is set in your Rails app's environment
    JWT.encode(payload, Rails.application.config.jwt_secret_key)
  end

  def auth_header
    request.headers["Authorization"]
  end

  def decoded_token
    if auth_header
      token = auth_header.split(" ")[1] # Bearer <token>
      begin
        JWT.decode(token, Rails.application.config.jwt_secret_key, true, algorithm: "HS256")
      rescue JWT::DecodeError
        nil
      end
    end
  end

  def current_user
    if decoded_token
      user_id = decoded_token[0]["user_id"]
      @current_user ||= User.find_by(id: user_id) # Use instance variable and memoization
    end
  end

  def logged_in?
    !!current_user
  end

  def authorized
    render json: { message: "Please log in" }, status: :unauthorized unless logged_in?
  end

  # Action to serve the Next.js frontend's entry point
  def serve_frontend
    # This assumes 'index.html' from your Next.js build (e.g., from 'out' or a custom setup)
    # has been copied into your Rails app's 'public' directory during the Heroku build process.
    # If your Next.js app is in a subdirectory of public, adjust the path.
    # Example: Rails.root.join('public', 'nextjs_app', 'index.html')
    render file: Rails.root.join("public", "index.html"), layout: false, content_type: "text/html"
  rescue ActionController::MissingFile
    # Fallback if index.html isn't found, maybe render a Rails 404 or a simple message
    render plain: "Frontend not found. Ensure Next.js assets are correctly placed in Rails' public directory.", status: :not_found
  end

  def health
    render json: { status: "UP" }, status: :ok
  end
end
