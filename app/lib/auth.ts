// File: frontend/src/lib/auth.ts (or your equivalent path)
"use client"; // If any functions here are intended for client-side only due to localStorage

import axios, { AxiosError } from "axios";
import { User, AuthError } from "../types/auth"; // Ensure this path is correct

// API URL for your Rails backend
const API_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

/**
 * Logs in a user.
 * Stores the user object (which includes the token, mapped from 'jwt') in localStorage.
 * @param email - User's email
 * @param password - User's password
 * @returns A Promise resolving to the User object (frontend format).
 */
export const login = async (email: string, password: string): Promise<User> => {
	try {
		// Define the expected backend response structure
		interface BackendLoginResponse {
			user: Omit<User, "token">; // User details without the token
			jwt: string; // Token from backend
		}

		const response = await axios.post<BackendLoginResponse>(
			`${API_URL}/login`,
			{ email, password },
		);

		// Check if the backend response has the expected structure (user object and jwt string)
		if (
			response.data &&
			response.data.user &&
			typeof response.data.jwt === "string"
		) {
			// Construct the user object for the frontend, mapping 'jwt' to 'token'
			const frontendUser: User = {
				...response.data.user, // Spread user details (id, username, email, etc.)
				token: response.data.jwt, // Add the token under the 'token' key
			};
			localStorage.setItem("user", JSON.stringify(frontendUser));
			console.log(
				"Login successful, user data stored in localStorage:",
				frontendUser,
			);
			return frontendUser; // Return the user object in the frontend's expected format
		} else {
			// This case implies the backend response format is not as expected
			console.error(
				"Login response missing user data or jwt token:",
				response.data,
			);
			throw new Error("Login failed: Invalid response format from server.");
		}
	} catch (error) {
		const axiosError = error as AxiosError<AuthError>;
		// Use the message from the error object if it exists, otherwise use a generic message
		const errorMessage =
			(axiosError.response?.data as AuthError)?.message ||
			axiosError.message ||
			"An unknown error occurred during login";
		console.error(
			"Login API Error:",
			axiosError.response?.data || axiosError.message,
		);
		throw {
			message: errorMessage,
			errors: (axiosError.response?.data as AuthError)?.errors,
		};
	}
}; // Ensure this function assignment is properly terminated with a semicolon.

/**
 * Signs up a new user.
 * Stores the user object (which includes the token, mapped from 'jwt') in localStorage.
 * @param username - User's username
 * @param email - User's email
 * @param password - User's password
 * @returns A Promise resolving to the User object (frontend format).
 */
export const signup = async (
	username: string,
	email: string,
	password: string,
): Promise<User> => {
	try {
		// Define the expected backend response structure (similar to login)
		interface BackendSignupResponse {
			user: Omit<User, "token">;
			jwt: string;
		}

		const payload = {
			user: { username, email, password }, // Ensure this matches Rails backend expectation
		};
		const response = await axios.post<BackendSignupResponse>(
			`${API_URL}/signup`,
			payload,
		);

		if (
			response.data &&
			response.data.user &&
			typeof response.data.jwt === "string"
		) {
			// Construct the user object for the frontend
			const frontendUser: User = {
				...response.data.user,
				token: response.data.jwt,
			};
			localStorage.setItem("user", JSON.stringify(frontendUser));
			console.log(
				"Signup successful, user data stored in localStorage:",
				frontendUser,
			);
			return frontendUser;
		} else {
			console.error(
				"Signup response missing user data or jwt token:",
				response.data,
			);
			throw new Error("Signup failed: Invalid response format from server.");
		}
	} catch (error) {
		const axiosError = error as AxiosError<AuthError>;
		const errorMessage =
			(axiosError.response?.data as AuthError)?.message ||
			axiosError.message ||
			"An unknown error occurred during signup";
		console.error(
			"Signup API Error:",
			axiosError.response?.data || axiosError.message,
		);
		throw {
			message: errorMessage,
			errors: (axiosError.response?.data as AuthError)?.errors,
		};
	}
}; // Ensure this function assignment is properly terminated with a semicolon.

/**
 * Logs out the current user by removing their data from localStorage.
 */
export const logout = (): void => {
	if (typeof window !== "undefined") {
		localStorage.removeItem("user");
		console.log("User logged out, data removed from localStorage.");
	}
	// Redirection should be handled by the AuthContext or the component calling logout.
}; // Ensure this function assignment is properly terminated with a semicolon.

/**
 * Retrieves the current user from localStorage.
 * Includes robust error handling for JSON parsing and basic validation.
 * The stored user object is expected to have a 'token' property.
 * @returns The User object if found and valid, otherwise null.
 */
export const getCurrentUser = (): User | null => {
	if (typeof window === "undefined") {
		// Ensure localStorage is available (client-side)
		return null;
	}

	const userStr = localStorage.getItem("user");
	if (userStr) {
		try {
			const user = JSON.parse(userStr) as User;
			// Basic validation: check for essential fields like id, username, and token.
			// This 'token' is what the frontendUser object (stored above) should have.
			// Carefully check this 'if' condition in your local file for any typos or missing parts.
			if (
				user &&
				typeof user.id !== "undefined" &&
				typeof user.username === "string" &&
				typeof user.token === "string"
			) {
				return user;
			} else {
				console.warn(
					"Parsed user data from localStorage is invalid or incomplete (expected 'token' property).",
					user,
				);
				localStorage.removeItem("user"); // Clear corrupted/invalid data
				return null;
			}
		} catch (error) {
			console.error("Failed to parse user JSON from localStorage:", error);
			localStorage.removeItem("user"); // Clear corrupted data
			return null;
		}
	}
	return null;
}; // Ensure this function assignment is properly terminated with a semicolon.

/**
 * Generates an authorization header if the user is logged in.
 * Assumes the token is stored as part of the user object (as 'token') in localStorage.
 * @returns An object containing the Authorization header, or an empty object.
 */
export const authHeader = (): Record<string, string> => {
	const user = getCurrentUser(); // This now uses the robust version

	// User object from localStorage should have user.token
	if (user && user.token) {
		return { Authorization: `Bearer ${user.token}` };
	} else {
		return {};
	}
}; // Ensure this function assignment is properly terminated with a semicolon.
