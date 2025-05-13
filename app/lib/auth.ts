// app/lib/auth.ts
"use client";

import axios, { AxiosError as AxiosErrorType } from "axios";
import { User, AuthError } from "../types/auth"; // User.profileImageUrl is string | undefined here

// --- API Configuration ---
function getApiBaseUrl(): string {
	const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
	if (envApiUrl) return envApiUrl;
	return typeof window !== "undefined"
		? "/api/v1"
		: "http://localhost:3000/api/v1";
}
const API_BASE_URL = getApiBaseUrl();

// --- Type Definitions for Backend Responses ---
interface BackendUser {
	id: number;
	username: string;
	email?: string;
	name?: string;
	profileImageUrl?: string | null; // Allows null from backend
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
		// Explicitly handle profileImageUrl: convert null to undefined
		// to match the frontend User type (string | undefined)
		profileImageUrl: profileImageUrl === null ? undefined : profileImageUrl,
	};
}

// --- Helper to Handle API Errors ---
function handleApiError(error: unknown, operationName: string): AuthError {
	const axiosError = error as AxiosErrorType<Partial<AuthError>>;
	let errorMessage = `An unknown error occurred during ${operationName}.`;
	let specificErrors: AuthError["errors"] = undefined;

	if (axiosError.isAxiosError) {
		if (axiosError.response && axiosError.response.data) {
			const responseData = axiosError.response.data;
			errorMessage = responseData.message || axiosError.message || errorMessage;
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
	return { message: errorMessage, errors: specificErrors };
}

// --- Authentication Functions ---
export const login = async (email: string, password: string): Promise<User> => {
	try {
		// Common Rails convention is to nest params under a 'user' key or a session key.
		// Adjust if your backend expects a flat payload.
		const response = await axios.post<BackendAuthResponse>(
			`${API_BASE_URL}/login`,
			{ user: { email, password } }, // Assuming backend expects user: { email, password }
		);
		const frontendUser = mapBackendToFrontendUser(response.data);
		localStorage.setItem("user", JSON.stringify(frontendUser));
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
		localStorage.setItem("user", JSON.stringify(frontendUser));
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
			typeof user.id === "number" && // Assuming User.id is number from app/types/auth.ts
			typeof user.username === "string" &&
			typeof user.token === "string"
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

export const authHeader = (): Record<string, string> => {
	const user = getCurrentUser();
	if (user && user.token) {
		return { Authorization: `Bearer ${user.token}` };
	}
	return {};
};
