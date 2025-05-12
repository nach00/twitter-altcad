# app/controllers/api/v1/authentication_controller.rb
module Api
  module V1
    class AuthenticationController < ApplicationController
      skip_before_action :authorized, only: [ :login, :signup ]
      # POST /api/v1/login
      def login
        @user = User.find_by(email: login_params[:email])

        if @user&.authenticate(login_params[:password])
          token = encode_token({ user_id: @user.id })
          render json: { user: UserSerializer.new(@user), jwt: token }, status: :accepted
        else
          render json: { message: "Invalid username or password" }, status: :unauthorized
        end
      end

      def signup
        @user = User.new(signup_params)
        if @user.save
          token = encode_token({ user_id: @user.id })
          render json: { user: UserSerializer.new(@user), jwt: token }, status: :created
        else
          puts "SIGNUP ERRORS: #{@user.errors.full_messages.inspect}" # Add this for debugging
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def login_params
        params.permit(:email, :password)
      end

      def signup_params
        # params.permit(:username, :email, :password, :password_confirmation)

        # If your frontend sends params nested under a 'user' key:
        params.require(:user).permit(:username, :email, :password, :password_confirmation)
      end
    end
  end
end
