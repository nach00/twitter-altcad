// File: app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

// Assuming DefaultLayout is in app/layouts/DefaultLayout.tsx
import DefaultLayout from "./layouts/DefaultLayout";
// Assuming AuthContext is in app/contexts/AuthContext.tsx
import { useAuth } from "./contexts/AuthContext";

import TweetComposer from "@/components/TweetComposer/TweetComposer";
// Corrected import path for TweetCard based on the artifact's location
import TweetCard from "@/components/TweetCard/TweetCard";
import { Tweet } from "@/types/tweet"; // Assuming your Tweet type is here

// Mock data for demonstration (replace with your actual data fetching)
// MOCK_USER is used if currentUser from AuthContext is not available for TweetComposer's profile image
const FALLBACK_MOCK_USER_PROFILE_IMAGE =
	"https://randomuser.me/api/portraits/men/32.jpg";

// Adjusted MOCK_TWEETS to align with the Tweet type and TweetCard props
const MOCK_TWEETS: Tweet[] = [
	{
		id: "1",
		content:
			"Just had a great session working on our new project. #coding #nextjs",
		createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
		likeCount: 24,
		retweetCount: 5,
		replyCount: 3,
		authorId: "author2", // Added authorId
		author: {
			id: "2",
			name: "Jane Smith",
			username: "janesmith",
			profileImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
		},
	},
	{
		id: "2",
		content:
			"Check out this amazing sunset I captured yesterday evening! #photography #sunset",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
		likeCount: 152,
		retweetCount: 28,
		replyCount: 12,
		// Changed 'media' array to 'mediaUrl' string
		mediaUrl:
			"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
		authorId: "author3", // Added authorId
		author: {
			id: "3",
			name: "Alex Johnson",
			username: "alexj",
			profileImageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
		},
	},
	{
		id: "3",
		content:
			"Just published my new article on web development best practices. Would love to hear your thoughts!",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
		likeCount: 87,
		retweetCount: 14,
		replyCount: 23,
		authorId: "author4", // Added authorId
		author: {
			id: "4",
			name: "Maria Garcia",
			username: "mariagarcia",
			profileImageUrl: "https://randomuser.me/api/portraits/women/29.jpg",
		},
	},
	{
		id: "4",
		content:
			"Excited to announce that I'll be speaking at the upcoming Tech Conference in San Francisco next month!",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
		likeCount: 245,
		retweetCount: 56,
		replyCount: 32,
		authorId: "author5", // Added authorId
		author: {
			id: "5",
			name: "David Wilson",
			username: "davidw",
			profileImageUrl: "https://randomuser.me/api/portraits/men/46.jpg",
		},
	},
];

export default function HomePage() {
	// Get authentication state and user data from AuthContext
	const { currentUser, logout, loading, isAuthenticated } = useAuth();

	// Handler for when a new tweet is submitted
	const handleTweet = (content: string, media?: File[]) => {
		if (!isAuthenticated || !currentUser) {
			// Using alert for simplicity, consider a more user-friendly notification system
			alert("Please log in or sign up to tweet.");
			// Optionally, redirect to login: router.push('/login');
			return;
		}
		// In a real application, this would send the tweet to your backend API
		console.log("New tweet:", {
			content,
			media,
			user: {
				id: currentUser.id,
				username: currentUser.username,
				name: currentUser.name || currentUser.username, // Assuming name might be optional
				profileImageUrl: currentUser.profileImageUrl,
			},
		});
		// Here you would typically:
		// 1. Call an API to create the tweet.
		// 2. On success, update the local state of tweets (e.g., add the new tweet to the top of the list).
		// For now, we'll just log it.
		// Example: addTweetToFeed({ id: Date.now().toString(), content, author: currentUser, createdAt: new Date().toISOString(), ... });
	};

	return (
		<DefaultLayout>
			{/* Header Section */}
			<header className="sticky top-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-700">
				<div className="container mx-auto flex justify-between items-center p-4">
					<Link href="/" legacyBehavior>
						<a className="text-xl font-bold text-gray-900 dark:text-white">
							Home
						</a>
					</Link>
					<div className="flex items-center space-x-2 sm:space-x-4">
						{loading ? (
							<span className="text-sm text-gray-500 dark:text-gray-400">
								Loading...
							</span>
						) : isAuthenticated && currentUser ? (
							<>
								<span className="hidden sm:inline text-sm sm:text-base text-gray-700 dark:text-gray-300">
									@{currentUser.username}
								</span>
								<button
									onClick={logout}
									className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded-md text-sm sm:text-base transition-colors"
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link href="/login" legacyBehavior>
									<a className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded-md text-sm sm:text-base transition-colors">
										Login
									</a>
								</Link>
								<Link href="/signup" legacyBehavior>
									<a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded-md text-sm sm:text-base transition-colors">
										Sign Up
									</a>
								</Link>
							</>
						)}
						{/* Sparkles button - functionality can be defined as needed */}
						<button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 p-1 sm:p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
							<Sparkles size={20} />
						</button>
					</div>
				</div>
			</header>

			{/* Tweet Composer Section */}
			{isAuthenticated && currentUser ? (
				<TweetComposer
					// Use current user's profile image or a fallback
					profileImageUrl={
						currentUser.profileImageUrl || FALLBACK_MOCK_USER_PROFILE_IMAGE
					}
					onTweet={handleTweet}
				/>
			) : (
				// Prompt to login/signup if not authenticated
				<div className="p-4 border-b border-gray-200 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-800">
					<p className="text-gray-700 dark:text-gray-300">
						<Link href="/login" legacyBehavior>
							<a className="text-blue-500 hover:underline font-semibold">
								Login
							</a>
						</Link>{" "}
						or{" "}
						<Link href="/signup" legacyBehavior>
							<a className="text-blue-500 hover:underline font-semibold">
								Sign Up
							</a>
						</Link>{" "}
						to post.
					</p>
				</div>
			)}

			{/* Timeline of Tweets Section */}
			<div className="divide-y divide-gray-200 dark:divide-gray-700">
				{MOCK_TWEETS.map((tweet) => (
					// Using the TweetCard component to render each tweet
					<TweetCard key={tweet.id} tweet={tweet} />
				))}
				{/* Placeholder for actual tweet fetching logic and empty state */}
				{MOCK_TWEETS.length === 0 && (
					<div className="p-8 text-center text-gray-500 dark:text-gray-400">
						<p>No tweets to show right now.</p>
						{!isAuthenticated && <p>Log in or sign up to see more content!</p>}
					</div>
				)}
			</div>
		</DefaultLayout>
	);
}
