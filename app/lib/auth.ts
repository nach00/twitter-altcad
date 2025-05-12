"use client";

import axios, { AxiosError } from "axios";
import { User, AuthError } from "../types/auth";

// Corrected API_URL
const API_URL = "http://localhost:3000/api/v1"; // Changed from /api to /api/v1

export const login = async (email: string, password: string): Promise<User> => {
	try {
		// Now this will correctly call http://localhost:3000/api/v1/login
		const response = await axios.post(`${API_URL}/login`, { email, password });

		if (response.data.token) {
			// Assuming your Rails response for login includes a 'user' object and a 'token'
			// If the user details are nested under a 'user' key in the response,
			// you might need to adjust what you store or how you structure it.
			// For example, if response.data is { user: { id: ..., email: ... }, token: "..." }
			// localStorage.setItem("user", JSON.stringify({ ...response.data.user, token: response.data.token }));
			// Or ensure your User type matches the structure of response.data
			localStorage.setItem("user", JSON.stringify(response.data));
		}

		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<AuthError>;
		console.error(
			"Login API Error:",
			axiosError.response?.data || axiosError.message,
		); // Log the actual error
		throw (
			axiosError.response?.data || { message: "An error occurred during login" }
		);
	}
};

export const signup = async (
	username: string,
	email: string,
	password: string,
): Promise<User> => {
	try {
		// This will correctly call http://localhost:3000/api/v1/signup
		const response = await axios.post(`${API_URL}/signup`, {
			// Ensure this matches what your Rails 'authentication#signup' expects
			// Your Rails controller might expect params[:user][:email], etc.
			// or just params[:email] directly.
			// The original code had `user: { username, email, password }`
			// Check your Rails authentication#signup controller's permitted params.
			user: { username, email, password },
		});

		if (response.data.token) {
			localStorage.setItem("user", JSON.stringify(response.data));
		}

		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<AuthError>;
		console.error(
			"Signup API Error:",
			axiosError.response?.data || axiosError.message,
		); // Log the actual error
		throw (
			axiosError.response?.data || {
				message: "An error occurred during signup",
			}
		);
	}
};

export const logout = (): void => {
	localStorage.removeItem("user");
};

export const getCurrentUser = (): User | null => {
	if (typeof window !== "undefined") {
		const userStr = localStorage.getItem("user");
		// Make sure what you parse here matches the User type,
		// especially regarding the presence of the token directly on the stored object.
		return userStr ? JSON.parse(userStr) : null;
	}
	return null;
};

// This authHeader function assumes the token is stored directly on the user object in localStorage
// e.g., localStorage stores: {"id":1,"email":"user@example.com","username":"user","token":"yourjwttoken"}
export const authHeader = (): Record<string, string> => {
	const user = getCurrentUser();

	if (user && user.token) {
		return { Authorization: `Bearer ${user.token}` };
	} else {
		return {};
	}
};
