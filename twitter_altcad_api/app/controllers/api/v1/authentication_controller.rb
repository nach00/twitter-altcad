# app/controllers/api/v1/auth_controller.rb
module Api
  module V1
    class AuthenticationController < ApplicationController
      skip_before_action :authorized, only: [ :create ] # Don't require login to log in




      # POST /api/v1/login
      def create
        @user = User.find_by(username: login_params[:username]) # Or find_by(email: login_params[:email])

        # User#authenticate method comes from has_secure_password
        if @user&.authenticate(login_params[:password])
          token = encode_token({ user_id: @user.id })
          render json: { user: UserSerializer.new(@user), jwt: token }, status: :accepted
        else
          render json: { message: "Invalid username or password" }, status: :unauthorized
        end
      end

      # You might also want a 'get profile' or 'auto_login' endpoint
      # GET /api/v1/profile
      # def profile
      #   render json: { user: UserSerializer.new(current_user) }, status: :accepted
      # end

      private

      def login_params
        params.require(:auth).permit(:username, :password) # Or :email instead of :username
      end
    end
  end
end
