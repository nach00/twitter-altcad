"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/auth"; // Assuming login might throw an error with a 'message' property
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import styles from "../../styles/auth.module.css";

// // Define a type for the expected error structure from your login function if it's not a standard Error
// interface AuthError extends Error {
//     // Add any other properties your error object might have
// }

// Or, more generally, if you expect an object with a message property:
interface ErrorWithMessage {
	message: string;
}

const Login: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const router = useRouter();
	const { setCurrentUser } = useAuth();

	const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const userData = await login(email, password);
			// Assuming setCurrentUser expects the type of userData returned by login
			setCurrentUser(userData);
			router.push("/");
		} catch (caughtError: unknown) {
			// Changed from 'err: any' to 'caughtError: unknown'
			let errorMessage = "Failed to login. Please check your credentials."; // Default message

			if (caughtError instanceof Error) {
				errorMessage = caughtError.message || errorMessage;
			} else if (
				typeof caughtError === "object" &&
				caughtError !== null &&
				"message" in caughtError &&
				typeof (caughtError as ErrorWithMessage).message === "string"
			) {
				// Handles errors that are objects with a message property but not necessarily Error instances
				errorMessage =
					(caughtError as ErrorWithMessage).message || errorMessage;
			} else if (typeof caughtError === "string") {
				// Handles cases where a plain string is thrown
				errorMessage = caughtError || errorMessage;
			}
			// If the error is of a different unexpected type, the default message will be used.

			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.loginContainer}>
			<div className={styles.loginForm}>
				<h1>Login to Twitter Clone</h1>

				{error && <div className={styles.errorMessage}>{error}</div>}

				<form onSubmit={handleLogin}>
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

					<button type="submit" disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<div className={styles.signupLink}>
					{/* If the error "react/no-unescaped-entities" at 77:9 was for an apostrophe in "Don't have an account?" or similar,
                        you would change it to "Don&apos;t have an account?".
                        The current text "No account?" does not have this issue.
                        Please ensure the line 77 error from your build log is addressed if it's still present.
                    */}
					No account? <Link href="/signup">Sign up</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
