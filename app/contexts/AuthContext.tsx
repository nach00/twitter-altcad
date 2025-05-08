"use client";

import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	ReactNode,
} from "react";
import { getCurrentUser, logout } from "../lib/auth";
import { useRouter } from "next/navigation";
import { User } from "../types/auth";

interface AuthContextType {
	currentUser: User | null;
	setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
	loading: boolean;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();

	useEffect(() => {
		// Check if user is logged in from localStorage
		const user = getCurrentUser();
		if (user) {
			setCurrentUser(user);
		}
		setLoading(false);
	}, []);

	const handleLogout = (): void => {
		logout();
		setCurrentUser(null);
		router.push("/login");
	};

	const value: AuthContextType = {
		currentUser,
		setCurrentUser,
		loading,
		logout: handleLogout,
		isAuthenticated: !!currentUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
