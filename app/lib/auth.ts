"use client";

import axios, { AxiosError } from "axios";
import { User, AuthError } from "../types/auth";

const API_URL = "http://localhost:3000/api";

export const login = async (email: string, password: string): Promise<User> => {
	try {
		const response = await axios.post(`${API_URL}/login`, { email, password });

		if (response.data.token) {
			localStorage.setItem("user", JSON.stringify(response.data));
		}

		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<AuthError>;
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
		const response = await axios.post(`${API_URL}/signup`, {
			user: { username, email, password },
		});

		if (response.data.token) {
			localStorage.setItem("user", JSON.stringify(response.data));
		}

		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<AuthError>;
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
		return userStr ? JSON.parse(userStr) : null;
	}
	return null;
};

export const authHeader = (): Record<string, string> => {
	const user = getCurrentUser();

	if (user && user.token) {
		return { Authorization: `Bearer ${user.token}` };
	} else {
		return {};
	}
};
