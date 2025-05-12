
		} catch (err) {
			const error = err as Error;
			setError(
				error.message || "Failed to login. Please check your credentials.",
			);
		} finally {
