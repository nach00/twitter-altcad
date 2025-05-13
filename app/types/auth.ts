// app/types/auth.ts

/**
 * Represents the structure of a User object after successful authentication.
 */
export interface User {
	id: number; // Unique identifier for the user
	username: string; // User's chosen username
	email?: string; // User's email address (optional)
	name?: string; // User's full name or display name (optional)
	token: string; // Authentication token
}

/**
 * Represents the structure of an error object for authentication processes.
 */
export interface AuthError {
	message: string; // A general error message
	errors?: Record<string, string[] | string> | string[] | string | null; // More specific field errors or a list of errors
	// The type for 'errors' can be more specific if you know its structure.
	// Examples:
	// errors?: { [fieldName: string]: string[] }; // For field-specific validation errors like { email: ["invalid format", "is required"] }
	// errors?: string[]; // For a list of general error messages
	// code?: string | number;
	// details?: Record<string, unknown>;
}
