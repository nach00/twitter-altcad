# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :authorized, only: [ :create ] # Don't require login to create a user

      # POST /api/v1/users (Signup)
      def create
        @user = User.new(user_params)
        if @user.save
          # Encode a token for the new user
          token = encode_token({ user_id: @user.id })
          render json: { user: UserSerializer.new(@user), jwt: token }, status: :created
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.require(:user).permit(:name, :username, :email, :password, :password_confirmation)
      end
    end
  end
end
