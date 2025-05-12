// app/profile/[id]/page.tsx
"use client"; // If you need client-side hooks for fetching or interaction

import React, { useEffect, useState } from "react";
// You'll likely need your User type
// import { User } from '@/types/auth'; // Adjust path as needed
// You might also want to use your DefaultLayout
// import DefaultLayout from '@/app/layouts/DefaultLayout'; // Adjust path

interface ProfilePageParams {
	params: {
		id: string; // The 'id' from the URL will be a string
	};
}

// Define a simple User type for this example
interface UserProfile {
	id: string;
	name: string;
	username: string;
	email: string;
	profileImageUrl?: string;
	bio?: string;
}

const UserProfilePage: React.FC<ProfilePageParams> = ({ params }) => {
	const { id: userId } = params;
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (userId) {
			const fetchUserProfile = async () => {
				setLoading(true);
				setError(null);
				try {
					// Replace with your actual API call to fetch user data by ID
					// const response = await fetch(`/api/users/${userId}`); // Example API endpoint
					// if (!response.ok) {
					//   throw new Error('Failed to fetch user profile');
					// }
					// const data: UserProfile = await response.json();
					// setUserProfile(data);

					// For demonstration, using mock data:
					console.log(`Fetching profile for user ID: ${userId}`);
					// Simulate API call
					await new Promise((resolve) => setTimeout(resolve, 1000));
					if (userId === "3") {
						// Example: only user "3" exists for demo
						setUserProfile({
							id: "3",
							name: "Mock User Three",
							username: "userthree",
							email: "user3@example.com",
							bio: "This is the bio of user three.",
							profileImageUrl:
								"https://randomuser.me/api/portraits/women/3.jpg",
						});
					} else {
						throw new Error(`User with ID ${userId} not found.`);
					}
				} catch (err: any) {
					setError(err.message || "An error occurred");
					setUserProfile(null);
				} finally {
					setLoading(false);
				}
			};
			fetchUserProfile();
		}
	}, [userId]);

	if (loading) {
		return <div className="p-4">Loading profile...</div>;
	}

	if (error) {
		return <div className="p-4 text-red-500">Error: {error}</div>;
	}

	if (!userProfile) {
		return <div className="p-4">User profile not found.</div>;
	}

	// Render the user's profile information
	// You would wrap this in your DefaultLayout if desired
	return (
		// <DefaultLayout>
		<div className="container mx-auto p-4">
			<div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
				{userProfile.profileImageUrl && (
					<img
						src={userProfile.profileImageUrl}
						alt={userProfile.name}
						className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
					/>
				)}
				<h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
					{userProfile.name}
				</h1>
				<p className="text-md text-gray-600 dark:text-gray-400 text-center">
					@{userProfile.username}
				</p>
				<p className="text-md text-gray-600 dark:text-gray-400 text-center mt-1">
					{userProfile.email}
				</p>
				{userProfile.bio && (
					<p className="mt-4 text-gray-700 dark:text-gray-300 text-center">
						{userProfile.bio}
					</p>
				)}
				{/* Add more profile details here */}
			</div>
		</div>
		// </DefaultLayout>
	);
};

export default UserProfilePage;
