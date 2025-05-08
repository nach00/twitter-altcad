import React from "react";
import Signup from "../components/auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign Up | Twitter Clone",
	description: "Create a new Twitter Clone account",
};

export default function SignupPage() {
	return <Signup />;
}
