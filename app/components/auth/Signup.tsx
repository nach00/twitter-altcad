"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../../lib/auth"; // Assuming this is the correct path
import { useAuth } from "../../contexts/AuthContext"; // Assuming this is the correct path
import Link from "next/link";
import styles from "../../styles/auth.module.css"; // Assuming this is the correct path

const Signup: React.FC = () => {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
	const [error, setError] = useState<string>(""); // This is the state for displaying errors
	const [loading, setLoading] = useState<boolean>(false);

	const router = useRouter();
	const { setCurrentUser } = useAuth();

	const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(""); // Clear previous errors

		// Validate password confirmation
		if (password !== passwordConfirmation) {
			setError("Passwords do not match");
			return;
		}

		setLoading(true);

		try {
			const userData = await signup(username, email, password);
			setCurrentUser(userData);
			router.push("/");
		} catch (caughtError: unknown) {
			// Changed from 'err: any' to 'caughtError: unknown'
			let messageToDisplay: string | undefined;

			if (caughtError instanceof Error) {
				// Standard JavaScript Error object
				messageToDisplay = caughtError.message;
			} else if (
				typeof caughtError === "object" &&
				caughtError !== null &&
				"message" in caughtError &&
				typeof (caughtError as { message: unknown }).message === "string"
			) {
				// Object with a string 'message' property
				messageToDisplay = (caughtError as { message: string }).message;
			}
			// If caughtError is none of the above (e.g., a string primitive, a number, or an object without a string message),
			// messageToDisplay will remain undefined.

			// Set the error message, falling back to a generic message if no specific message was extracted
			// or if the extracted message was an empty string (which is falsy).
			setError(
				messageToDisplay || "Failed to create account. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.signupContainer}>
			<div className={styles.signupForm}>
				<h1>Create your account</h1>

				{error && <div className={styles.errorMessage}>{error}</div>}

				<form onSubmit={handleSignup}>
					<div className={styles.formGroup}>
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setUsername(e.target.value)
							}
							required
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setEmail(e.target.value)
							}
							required
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setPassword(e.target.value)
							}
							required
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="password-confirmation">Confirm Password</label>
						<input
							type="password"
							id="password-confirmation"
							value={passwordConfirmation}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setPasswordConfirmation(e.target.value)
							}
							required
						/>
					</div>

					<button type="submit" disabled={loading}>
						{loading ? "Creating account..." : "Sign up"}
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
