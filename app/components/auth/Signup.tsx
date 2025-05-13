// src/app/components/auth/Signup.tsx
"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Import the centralized User type and the signup function
// Adjust relative paths as necessary based on your actual file structure
import { User as AppUser } from "../../types/auth"; // Path to app/types/auth.ts
import { signup as apiSignup } from "../../lib/auth"; // Path to app/lib/auth.ts
import { useAuth } from "../../contexts/AuthContext"; // Path to app/contexts/AuthContext.ts
import styles from "../../styles/auth.module.css"; // Path to app/styles/auth.module.css

// --- Signup Component ---

const Signup: React.FC = () => {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const router = useRouter();
	// useAuth() should be typed at its source (AuthContext.tsx)
	// to ensure setCurrentUser expects AppUser (where id is number)
	const { setCurrentUser } = useAuth();

	const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void =>
		setUsername(e.target.value);
	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void =>
		setEmail(e.target.value);
	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void =>
		setPassword(e.target.value);
	const handlePasswordConfirmationChange = (
		e: ChangeEvent<HTMLInputElement>,
	): void => setPasswordConfirmation(e.target.value);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setErrorMessage("");

		if (password !== passwordConfirmation) {
			setErrorMessage("Passwords do not match. Please re-enter.");
			return;
		}
		if (password.length < 8) {
			setErrorMessage("Password must be at least 8 characters long.");
			return;
		}

		setIsLoading(true);

		try {
			// apiSignup from ../../lib/auth MUST return a Promise<AppUser>
			// where AppUser.id is a number (as defined in app/types/auth.ts)
			const userData: AppUser = await apiSignup(username, email, password);

			// setCurrentUser (from useAuth) must also expect an AppUser
			// where AppUser.id is a number. This consistency is key.
			setCurrentUser(userData);
			router.push("/");
		} catch (caughtError: unknown) {
			let specificMessage: string | undefined;

			if (caughtError instanceof Error) {
				specificMessage = caughtError.message;
			} else if (
				typeof caughtError === "object" &&
				caughtError !== null &&
				"message" in caughtError &&
				typeof (caughtError as { message: unknown }).message === "string"
			) {
				specificMessage = (caughtError as { message: string }).message;
			} else if (typeof caughtError === "string") {
				specificMessage = caughtError;
			}
			setErrorMessage(
				specificMessage || "Failed to create account. Please try again later.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.signupContainer}>
			<div className={styles.signupForm}>
				<h1>Create your account</h1>
				{errorMessage && (
					<div className={styles.errorMessage}>{errorMessage}</div>
				)}
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id="username"
							name="username"
							value={username}
							onChange={handleUsernameChange}
							required
							autoComplete="username"
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={email}
							onChange={handleEmailChange}
							required
							autoComplete="email"
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={handlePasswordChange}
							required
							autoComplete="new-password"
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="password-confirmation">Confirm Password</label>
						<input
							type="password"
							id="password-confirmation"
							name="password_confirmation"
							value={passwordConfirmation}
							onChange={handlePasswordConfirmationChange}
							required
							autoComplete="new-password"
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						className={styles.submitButton}
					>
						{isLoading ? "Creating account..." : "Sign up"}
					</button>
				</form>
				<div className={styles.loginLink}>
					Already have an account? <Link href="/login">Log in</Link>
				</div>
			</div>
		</div>
	);
};

export default Signup;
