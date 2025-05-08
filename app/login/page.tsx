import React from "react";
import Login from "../components/auth/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login | Twitter Clone",
	description: "Login to your Twitter Clone account",
};

export default function LoginPage() {
	return <Login />;
}
