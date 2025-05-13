# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApplicationController
      # For signup (create), authorization is not required.
      skip_before_action :authorized, only: [ :create ]

      # GET /api/v1/users
      def index
        @users = User.all # Example: paginate this in a real app
        render json: @users.map { |user| UserSerializer.new(user) } # Or use a collection serializer
      end

      # GET /api/v1/users/:id
      def show
        @user = User.find_by(id: params[:id]) # Or find_by(username: params[:id]) if using username in route
        if @user
          render json: UserSerializer.new(@user)
        else
          render json: { error: "User not found" }, status: :not_found
        end
      end

      # POST /api/v1/signup (mapped to users#create)
      def create
        @user = User.new(user_params)
        if @user.save
          token = encode_token({ user_id: @user.id })
          # Ensure UserSerializer returns what frontend's BackendUser type expects
          render json: { user: UserSerializer.new(@user).as_json, jwt: token }, status: :created
        else
          render json: { message: "Failed to create user.", errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        # Frontend sends username, email, password.
        # Password confirmation is good practice but ensure frontend sends it if required by model.
        # Name is optional here if not sent by frontend during signup.
        params.require(:user).permit(:username, :email, :password, :password_confirmation, :name)
      end
    end
  end
end
