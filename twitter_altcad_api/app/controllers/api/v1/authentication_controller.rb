# app/controllers/api/v1/authentication_controller.rb
module Api
  module V1
    class AuthenticationController < ApplicationController
      # Login does not require prior authorization.
      skip_before_action :authorized, only: [ :login ]

      # POST /api/v1/login
      def login
        @user = User.find_by(email: login_params[:email]) # Or username, adapt login_params

        if @user&.authenticate(login_params[:password]) # Assumes has_secure_password
          token = encode_token({ user_id: @user.id })
          # Ensure UserSerializer returns what frontend's BackendUser type expects
          render json: { user: UserSerializer.new(@user).as_json, jwt: token }, status: :accepted
        else
          render json: { message: "Invalid email or password." }, status: :unauthorized
        end
      end

      # SIGNUP ACTION REMOVED FROM HERE

      private

      def login_params
        # Frontend sends user: { email, password }. Adjust if it sends flat params.
        # params.require(:user).permit(:email, :password)
        # If your frontend app/lib/auth.ts login sends flat {email, password}:
        params.permit(:email, :password)
      end

      # SIGNUP_PARAMS METHOD REMOVED FROM HERE
    end
  end
end
