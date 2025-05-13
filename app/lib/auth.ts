// app/lib/auth.ts (assuming this is the correct path within your Next.js app structure)
"use client"; // Mark as client component module due to localStorage usage

import axios, { AxiosError as AxiosErrorType } from "axios"; // Renamed for clarity
import { User, AuthError } from "../types/auth"; // Adjust path as necessary

// --- API Configuration ---

/**
 * Determines the base URL for API requests.
 * - In production (when NEXT_PUBLIC_API_URL is not set or is a relative path like "/api/v1"),
 *   it uses a relative path, assuming the API is served from the same origin as the frontend.
 * - In development, it falls back to a default (e.g., http://localhost:3000/api/v1)
 *   or uses NEXT_PUBLIC_API_URL if set (e.g., for testing against a staged backend).
 */
function getApiBaseUrl(): string {
	const envApiUrl = process.env.NEXT_PUBLIC_API_URL;

	if (envApiUrl) {
		// If NEXT_PUBLIC_API_URL is set (could be absolute for dev/staging, or relative for prod)
		return envApiUrl;
	}
	// Default for production (relative path if API is same-origin) or local dev fallback
	return typeof window !== "undefined"
		? "/api/v1"
		: "http://localhost:3000/api/v1";
	// The check for `typeof window` makes it safer for SSR/SSG if this file were ever imported server-side,
	// though "use client" primarily scopes it. For pure client-side, "/api/v1" is usually fine for prod.
}

const API_BASE_URL = getApiBaseUrl();

// --- Type Definitions for Backend Responses ---
// These help in type-safe parsing of what the Rails backend sends.

interface BackendUser {
	// Define this based on what your Rails API's UserSerializer actually returns
	// This should match the `Omit<User, "token">` usage if User type has no extra frontend-only fields.
	id: number; // Or string, must match your `app/types/auth.ts User.id`
	username: string;
	email?: string;
	name?: string;
	profileImageUrl?: string | null;
	// Any other fields your backend user object has
}

interface BackendAuthResponse {
	user: BackendUser;
	jwt: string; // Assuming backend sends token as 'jwt'
}

// --- Helper to Construct Frontend User ---
function mapBackendToFrontendUser(backendResponse: BackendAuthResponse): User {
	if (!backendResponse.user || typeof backendResponse.jwt !== "string") {
		console.error(
			"Invalid backend response structure for user mapping:",
			backendResponse,
		);
		throw new Error("Received invalid user data from server.");
	}
	return {
		...backendResponse.user, // Spread properties from backendUser
		token: backendResponse.jwt, // Map 'jwt' to 'token'
	};
}

// --- Helper to Handle API Errors ---
function handleApiError(error: unknown, operationName: string): AuthError {
	const axiosError = error as AxiosErrorType<Partial<AuthError>>; // Use Partial<AuthError> for safer access
	let errorMessage = `An unknown error occurred during ${operationName}.`;
	let specificErrors: AuthError["errors"] = undefined; // Match AuthError['errors'] type

	if (axiosError.isAxiosError) {
		if (axiosError.response && axiosError.response.data) {
			const responseData = axiosError.response.data;
			errorMessage = responseData.message || axiosError.message || errorMessage;
			// Safely access 'errors' if it exists on responseData
			if (responseData.errors !== undefined) {
				specificErrors = responseData.errors;
			}
		} else {
			errorMessage = axiosError.message || errorMessage;
		}
	} else if (error instanceof Error) {
		errorMessage = error.message;
	}

	console.error(
		`${operationName} API Error:`,
		errorMessage,
		specificErrors || "",
	);
	return { message: errorMessage, errors: specificErrors }; // Return a structured AuthError
}

// --- Authentication Functions ---

/**
 * Logs in a user.
 * Stores the user object (which includes the token) in localStorage.
 */
export const login = async (email: string, password: string): Promise<User> => {
	try {
		const response = await axios.post<BackendAuthResponse>(
			// Expect BackendAuthResponse
			`${API_BASE_URL}/login`, // Ensure this path matches your Rails API login route
			{ user: { email, password } }, // Adjust payload if Rails expects different (e.g., just email, password)
		);
		const frontendUser = mapBackendToFrontendUser(response.data);
		localStorage.setItem("user", JSON.stringify(frontendUser));
		console.log("Login successful:", frontendUser);
		return frontendUser;
	} catch (error) {
		throw handleApiError(error, "login");
	}
};

/**
 * Signs up a new user.
 * Stores the user object (which includes the token) in localStorage.
 */
export const signup = async (
	username: string,
	email: string,
	password: string,
): Promise<User> => {
	try {
		const payload = { user: { username, email, password } }; // Common Rails convention
		const response = await axios.post<BackendAuthResponse>(
			// Expect BackendAuthResponse
			`${API_BASE_URL}/signup`, // Ensure this path matches your Rails API signup route
			payload,
		);
		const frontendUser = mapBackendToFrontendUser(response.data);
		localStorage.setItem("user", JSON.stringify(frontendUser));
		console.log("Signup successful:", frontendUser);
		return frontendUser;
	} catch (error) {
		throw handleApiError(error, "signup");
	}
};

/**
 * Logs out the current user by removing their data from localStorage.
 */
export const logout = (): void => {
	if (typeof window !== "undefined") {
		localStorage.removeItem("user");
		console.log("User logged out.");
		// Redirection is typically handled by the calling component or context
	}
};

/**
 * Retrieves the current user from localStorage.
 * Validates the structure of the stored user object.
 */
export const getCurrentUser = (): User | null => {
	if (typeof window === "undefined") return null;

	const userStr = localStorage.getItem("user");
	if (!userStr) return null;

	try {
		const user = JSON.parse(userStr) as User; // Assume it matches frontend User type
		// Validate essential properties expected in the frontend User object
		if (
			user &&
			typeof user.id !== "undefined" && // Check type based on your User.id (number or string)
			typeof user.username === "string" &&
			typeof user.token === "string" // Crucial for auth
		) {
			return user;
		} else {
			console.warn(
				"Stored user data is invalid or incomplete. Clearing.",
				user,
			);
			localStorage.removeItem("user");
			return null;
		}
	} catch (parseError) {
		console.error(
			"Failed to parse user JSON from localStorage. Clearing.",
			parseError,
		);
		localStorage.removeItem("user");
		return null;
	}
};

/**
 * Generates an authorization header if the user is logged in.
 */
export const authHeader = (): Record<string, string> => {
	const user = getCurrentUser();
	if (user && user.token) {
		return { Authorization: `Bearer ${user.token}` };
	}
	return {};
};
