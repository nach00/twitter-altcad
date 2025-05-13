// app/profile/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DefaultLayout from "@/app/layouts/DefaultLayout";

// Props for this specific page
interface UserProfilePageProps {
	params: {
		id: string; // The 'id' from the URL will be a string
	};
	// If you ever need searchParams, you can add them:
	// searchParams?: { [key: string]: string | string[] | undefined };
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

// MODIFICATION: Change how the component is typed
const UserProfilePage = ({ params }: UserProfilePageProps): JSX.Element => {
	const { id: userId } = params; // userId will be a string.
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserProfile = async () => {
			setLoading(true);
			setError(null);
			try {
				// Corrected a typo in the log message
				console.log(`Workspaceing profile for user ID: ${userId}`);
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

				if (userId === "3") {
					setUserProfile({
						id: "3",
						name: "Mock User Three",
						username: "userthree",
						email: "user3@example.com",
						bio: "This is the bio of user three.",
						profileImageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
					});
				} else {
					setUserProfile(null); // Ensure userProfile is null on error
					throw new Error(`User with ID ${userId} not found.`);
				}
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unexpected error occurred");
				}
				setUserProfile(null); // Ensure userProfile is null on any error
			} finally {
				setLoading(false);
			}
		};

		// The `if (userId)` check here is generally safe.
		// While `params.id` is guaranteed by Next.js for this route structure,
		// explicit checks don't harm and can guard against unexpected undefined states if props were altered.
		if (userId) {
			fetchUserProfile();
		} else {
			// This block should ideally be unreachable given the route structure.
			setError("User ID is missing.");
			setLoading(false);
			setUserProfile(null);
		}
	}, [userId]);

	if (loading) {
		return (
			<DefaultLayout>
				<div className="flex justify-center items-center h-screen">
					<div className="p-4">Loading profile...</div>
				</div>
			</DefaultLayout>
		);
	}

	if (error) {
		return (
			<DefaultLayout>
				<div className="flex justify-center items-center h-screen">
					<div className="p-4 text-red-500">Error: {error}</div>
				</div>
			</DefaultLayout>
		);
	}

	if (!userProfile) {
		return (
			<DefaultLayout>
				<div className="flex justify-center items-center h-screen">
					<div className="p-4">User profile not found.</div>
				</div>
			</DefaultLayout>
		);
	}

	return (
		<DefaultLayout>
			<div className="container mx-auto p-4">
				<div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 max-w-2xl mx-auto">
					{userProfile.profileImageUrl && (
						<div className="flex justify-center mb-6">
							<Image
								src={userProfile.profileImageUrl}
								alt={`${userProfile.name}'s profile picture`}
								width={128}
								height={128}
								className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
								priority
							/>
						</div>
					)}
					<h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
						{userProfile.name}
					</h1>
					<p className="text-lg text-gray-500 dark:text-gray-400 text-center">
						@{userProfile.username}
					</p>
					<p className="text-md text-gray-600 dark:text-gray-400 text-center mt-1">
						{userProfile.email}
					</p>
					{userProfile.bio && (
						<p className="mt-6 text-gray-700 dark:text-gray-300 text-center text-lg leading-relaxed">
							{userProfile.bio}
						</p>
					)}
					{/* Add more profile details here if needed */}
				</div>
			</div>
		</DefaultLayout>
	);
};

export default UserProfilePage;
