// File: app/page.tsx
"use client";

import React from "react"; // Removed unused imports like useState, useEffect for this specific file
import Link from "next/link";
import { Sparkles } from "lucide-react";

// Assuming DefaultLayout and AuthContext are correctly pathed relative to `app/page.tsx`
import DefaultLayout from "./layouts/DefaultLayout";
import { useAuth } from "./contexts/AuthContext";

// Assuming TweetComposer and TweetCard are correctly pathed using aliases
import TweetComposer from "@/components/TweetComposer/TweetComposer";
import TweetCard from "@/components/TweetCard/TweetCard";
import { Tweet, TweetAuthor } from "@/app/types/tweet"; // Import both Tweet and TweetAuthor
// import { User as AuthUser } from "@/app/types/auth"; // Import your main User type for AuthContext

// --- Mock Data (Keep this or replace with actual data fetching) ---
const FALLBACK_MOCK_USER_PROFILE_IMAGE =
	"https://randomuser.me/api/portraits/men/32.jpg";

// MOCK_TWEETS now uses the imported Tweet type
const MOCK_TWEETS: Tweet[] = [
	{
		id: "twt1", // Changed ID for clarity
		authorId: "usr2",
		content:
			"Just had a great session working on our new project. #coding #nextjs",
		createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
		likeCount: 24,
		retweetCount: 5,
		replyCount: 3,
		author: {
			id: "usr2",
			name: "Jane Smith",
			username: "janesmith",
			profileImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
		},
	},
	{
		id: "twt2",
		authorId: "usr3",
		content:
			"Check out this amazing sunset I captured yesterday evening! #photography #sunset",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
		likeCount: 152,
		retweetCount: 28,
		replyCount: 12,
		mediaUrl:
			"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
		author: {
			id: "usr3",
			name: "Alex Johnson",
			username: "alexj",
			profileImageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
		},
	},
	// Add more mock tweets if needed
];

// --- HomePage Component ---
export default function HomePage() {
	const {
		currentUser,
		logout,
		isLoading: authLoading,
		isAuthenticated,
	} = useAuth(); // Renamed loading to authLoading

	const handleNewTweet = (content: string, mediaFiles?: File[]): void => {
		if (!isAuthenticated || !currentUser) {
			alert("Please log in or sign up to tweet.");
			return;
		}

		// Construct author data from the authenticated user
		const tweetAuthor: TweetAuthor = {
			// Ensure currentUser.id type matches TweetAuthor.id type (string or number)
			// If currentUser.id is number and TweetAuthor.id is string, convert: String(currentUser.id)
			id: String(currentUser.id), // Assuming currentUser.id is number and TweetAuthor.id is string
			name: currentUser.name || currentUser.username,
			username: currentUser.username,
			profileImageUrl: currentUser.profileImageUrl || undefined, // Ensure it can be undefined if not present
		};

		// In a real application, send this to your backend:
		console.log("New tweet submitted:", {
			content,
			mediaFiles, // These would be uploaded
			author: tweetAuthor,
			// Other necessary tweet data
		});

		// Optimistically update UI or re-fetch tweets
		// For example, create a new mock tweet and add it to a local state
		// const newTweet: Tweet = {
		//   id: `new_${Date.now()}`,
		//   authorId: tweetAuthor.id,
		//   content,
		//   createdAt: new Date().toISOString(),
		//   likeCount: 0,
		//   retweetCount: 0,
		//   replyCount: 0,
		//   author: tweetAuthor,
		//   // mediaUrl: "..." // If media was uploaded and URL is available
		// };
		// setLocalTweets([newTweet, ...localTweets]); // If using local state for tweets
		alert("Tweet submitted (logged to console)!");
	};

	return (
		<DefaultLayout>
			<header className="sticky top-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-700">
				<div className="container mx-auto flex justify-between items-center p-4">
					<Link
						href="/"
						className="text-xl font-bold text-gray-900 dark:text-white"
					>
						Home
					</Link>
					<div className="flex items-center space-x-2 sm:space-x-4">
						{authLoading ? (
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
								<Link
									href="/login"
									className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded-md text-sm sm:text-base transition-colors"
								>
									Login
								</Link>
								<Link
									href="/signup"
									className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded-md text-sm sm:text-base transition-colors"
								>
									Sign Up
								</Link>
							</>
						)}
						<button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 p-1 sm:p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
							<Sparkles size={20} />
						</button>
					</div>
				</div>
			</header>

			{isAuthenticated && currentUser ? (
				<TweetComposer
					profileImageUrl={
						currentUser.profileImageUrl || FALLBACK_MOCK_USER_PROFILE_IMAGE
					}
					onTweet={handleNewTweet} // Renamed handler
				/>
			) : (
				<div className="p-4 border-b border-gray-200 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-800">
					<p className="text-gray-700 dark:text-gray-300">
						<Link
							href="/login"
							className="text-blue-500 hover:underline font-semibold"
						>
							Login
						</Link>{" "}
						or{" "}
						<Link
							href="/signup"
							className="text-blue-500 hover:underline font-semibold"
						>
							Sign Up
						</Link>{" "}
						to post.
					</p>
				</div>
			)}

			<div className="divide-y divide-gray-200 dark:divide-gray-700">
				{MOCK_TWEETS.map((tweet) => (
					<TweetCard key={tweet.id} tweet={tweet} />
				))}
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
