"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/auth";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import styles from "../../styles/auth.module.css";

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
			setCurrentUser(userData);
			router.push("/");
		} catch (err: any) {
			setError(
				err.message || "Failed to login. Please check your credentials.",
			);
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
					Don't have an account? <Link href="/signup">Sign up</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
