"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../../lib/auth";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import styles from "../../styles/auth.module.css";

const Signup: React.FC = () => {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const router = useRouter();
	const { setCurrentUser } = useAuth();

	const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

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
		} catch (err: any) {
			setError(err.message || "Failed to create account. Please try again.");
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
