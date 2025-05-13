// app/types/auth.ts

/**
 * Represents the structure of a User object after successful authentication.
 */
export interface User {
	id: number; // Unique identifier for the user (e.g., from the database)
	username: string; // User's chosen username
	email?: string; // User's email address (optional)
	name?: string; // User's full name or display name (optional)
	token: string; // Authentication token
}

/**
 * Represents the structure of an error object for authentication processes.
 */
export interface AuthError {
	message: string;
	// code?: string | number;
	// details?: Record<string, unknown>;
}
