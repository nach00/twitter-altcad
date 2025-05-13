"use client";

import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	ReactNode,
	useCallback, // For memoizing functions
	useMemo, // For memoizing the context value object
} from "react";
import { useRouter } from "next/navigation";

// Assuming AuthContext.tsx is in app/contexts/, adjust paths if necessary
import {
	getCurrentUser as loadUserFromStorage,
	logout as clearUserFromStorage,
} from "../lib/auth";
import { User } from "../types/auth";

// Interface defining the shape of the authentication context
interface AuthContextType {
	currentUser: User | null;
	setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>; // Type for useState's setter
	isLoading: boolean; // Renamed from 'loading' for convention
	logout: () => void; // The function to log out the user
	isAuthenticated: boolean; // Derived state indicating if a user is logged in
}

// Create the context. Initialized to `null`.
// Consumers must be descendants of an AuthProvider to get a non-null value.
const AuthContext = createContext<AuthContextType | null>(null);

// Props for the AuthProvider component
interface AuthProviderProps {
	children: ReactNode; // AuthProvider wraps its children to provide them with context
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true); // State to track initial loading of user data
	const router = useRouter();

	// Effect to check for an existing user session on initial component mount
	useEffect(() => {
		// Attempt to load user from persistent storage (e.g., localStorage)
		const userFromStorage: User | null = loadUserFromStorage();
		if (userFromStorage) {
			setCurrentUser(userFromStorage); // Set user in state if found
		}
		setIsLoading(false); // Mark initial loading as complete
	}, []); // Empty dependency array ensures this effect runs only once after the initial render

	// Memoized logout function.
	// useCallback ensures that `handleLogout` function reference remains stable across re-renders,
	// unless its dependencies (in this case, `router`) change.
	// This is beneficial if `logout` is passed as a prop or used as a dependency in other hooks/memoized components.
	const handleLogout = useCallback((): void => {
		clearUserFromStorage(); // Clear user data from persistent storage
		setCurrentUser(null); // Clear user from React state
		router.push("/login"); // Redirect the user to the login page
	}, [router]); // `router` from `useRouter` is generally stable but listed as a dependency.

	// Memoize the context value object.
	// This prevents consumers of the AuthContext from re-rendering unnecessarily if the AuthProvider
	// re-renders but the actual context values (currentUser, isLoading, etc.) haven't changed.
	// The identity of the `contextValue` object will only change if one of its dependencies changes.
	const contextValue = useMemo<AuthContextType>(
		() => ({
			currentUser,
			setCurrentUser, // `setCurrentUser` from useState has a stable identity, no need to list as dependency for itself
			isLoading,
			logout: handleLogout, // Use the memoized logout handler
			isAuthenticated: !!currentUser, // Derived boolean for authentication status
		}),
		[currentUser, isLoading, handleLogout],
	);
	// Dependencies:
	// - `currentUser`: If the user logs in/out, or their details change.
	// - `isLoading`: When the initial loading state changes.
	// - `handleLogout`: If the `handleLogout` function reference changes (which is rare due to useCallback).

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

// Custom hook to easily consume the AuthContext within functional components
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);

	// Ensure the hook is used within a component tree wrapped by AuthProvider
	if (context === null) {
		// Explicitly check against null, matching createContext initial value
		throw new Error(
			"useAuth must be used within an AuthProvider. Make sure your component is a descendant of <AuthProvider>.",
		);
	}
	return context;
};
