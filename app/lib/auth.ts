// app/lib/auth.ts
"use client";

import axios, { AxiosError as AxiosErrorType } from "axios";
import { User, AuthError } from "../types/auth";

// --- API Configuration ---
function getApiBaseUrl(): string {
	const envApiUrl = process.env.NEXT_PUBLIC_API_URL;

	if (envApiUrl) {
		// This branch is used if NEXT_PUBLIC_API_URL is explicitly set.
		// Useful for:
		// 1. Local development targeting a local Rails server on a different port (e.g., http://localhost:3000/api/v1)
		// 2. A two-app Heroku setup where this points to the separate backend Heroku URL.
		// For a single Heroku app, NEXT_PUBLIC_API_URL should generally NOT be set on Heroku.
		return envApiUrl;
	}

	// Default for single-app production (relative path, API served from same origin)
	// or if NEXT_PUBLIC_API_URL is not set during local development (assuming API is relative).
	return "/api/v1";
}

const API_BASE_URL = getApiBaseUrl();
console.log("Auth API URL:", API_BASE_URL); // For debugging in browser console

// --- Type Definitions for Backend Responses ---
interface BackendUser {
	id: number; // Matches User.id from app/types/auth.ts
	username: string;
	email?: string;
	name?: string;
	profileImageUrl?: string | null;
}

interface BackendAuthResponse {
	user: BackendUser;
	jwt: string;
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
	const { profileImageUrl, ...otherBackendDetails } = backendResponse.user;
	return {
		...otherBackendDetails,
		token: backendResponse.jwt,

		profileImageUrl: profileImageUrl === null ? undefined : profileImageUrl,
	};
}

// --- Helper to Handle API Errors ---
function handleApiError(error: unknown, operationName: string): AuthError {
	const axiosError = error as AxiosErrorType<Partial<AuthError> | string>;
	let errorMessage = `An unknown error occurred during ${operationName}.`;
	let specificErrors: AuthError["errors"] = undefined;

	if (axiosError.isAxiosError) {
		console.error(`Raw ${operationName} Axios error:`, axiosError);
		if (axiosError.response) {
			console.error(
				`Raw ${operationName} Axios error response data:`,
				axiosError.response.data,
			);
			const responseData = axiosError.response.data;
			if (
				typeof responseData === "string" &&
				responseData.toLowerCase().includes("<html")
			) {
				errorMessage = `${operationName} failed: Server responded with HTML (status ${axiosError.response.status}), not JSON. Check API endpoint and server routing.`;
			} else if (
				typeof responseData === "object" &&
				responseData !== null &&
				responseData.message
			) {
				errorMessage = responseData.message;
				if (responseData.errors !== undefined) {
					specificErrors = responseData.errors;
				}
			} else if (axiosError.response.statusText) {
				errorMessage = `${operationName} failed: ${axiosError.response.status} ${axiosError.response.statusText}`;
			} else {
				errorMessage = axiosError.message || errorMessage;
			}
		} else if (axiosError.request) {
			// Request was made but no response received (e.g., network error, server down)
			errorMessage = `${operationName} failed: No response received from server. Check network or server status.`;
		} else {
			errorMessage = axiosError.message || errorMessage;
		}
	} else if (error instanceof Error) {
		errorMessage = error.message;
	}

	console.error(
		`${operationName} API Error (processed):`,
		errorMessage,
		specificErrors || "",
	);
	return { message: errorMessage, errors: specificErrors };
}

// --- Authentication Functions ---
export const login = async (email: string, password: string): Promise<User> => {
	try {
		const response = await axios.post<BackendAuthResponse>(
			`${API_BASE_URL}/login`,
			{ user: { email, password } }, // Rails convention often expects params nested under model name
		);
		const frontendUser = mapBackendToFrontendUser(response.data);
		if (typeof window !== "undefined") {
			localStorage.setItem("user", JSON.stringify(frontendUser));
		}
		console.log("Login successful:", frontendUser);
		return frontendUser;
	} catch (error) {
		throw handleApiError(error, "login");
	}
};

export const signup = async (
	username: string,
	email: string,
	password: string,
): Promise<User> => {
	try {
		const payload = { user: { username, email, password } };
		const response = await axios.post<BackendAuthResponse>(
			`${API_BASE_URL}/signup`,
			payload,
		);
		const frontendUser = mapBackendToFrontendUser(response.data);
		if (typeof window !== "undefined") {
			localStorage.setItem("user", JSON.stringify(frontendUser));
		}
		console.log("Signup successful:", frontendUser);
		return frontendUser;
	} catch (error) {
		throw handleApiError(error, "signup");
	}
};

export const logout = (): void => {
	if (typeof window !== "undefined") {
		localStorage.removeItem("user");
		console.log("User logged out.");
	}
};

export const getCurrentUser = (): User | null => {
	if (typeof window === "undefined") return null;
	const userStr = localStorage.getItem("user");
	if (!userStr) return null;
	try {
		const user = JSON.parse(userStr) as User;
		if (
			user &&
			typeof user.id === "number" &&
			typeof user.username === "string" &&
			typeof user.token === "string"
		) {
			return user;
		}
		console.warn("Stored user data is invalid or incomplete. Clearing.", user);
		localStorage.removeItem("user");
		return null;
	} catch (parseError) {
		console.error(
			"Failed to parse user JSON from localStorage. Clearing.",
			parseError,
		);
		localStorage.removeItem("user");
		return null;
	}
};

export const authHeader = (): Record<string, string> => {
	const user = getCurrentUser();
	if (user && user.token) {
		return { Authorization: `Bearer ${user.token}` };
	}
	return {};
};
