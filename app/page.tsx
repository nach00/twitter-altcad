// "use client";
// import React from "react";
// import DefaultLayout from "./layouts/DefaultLayout";
// import TweetComposer from "@/components/TweetComposer/TweetComposer";
// import TweetCard from "@/components/TweetCard/TweetCard";
// import { Sparkles } from "lucide-react";
//
// // Mock data for demonstration
// const MOCK_USER = {
// 	id: "1",
// 	name: "John Doe",
// 	username: "johndoe",
// 	profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
// };
//
// const MOCK_TWEETS = [
// 	{
// 		id: "1",
// 		content:
// 			"Just had a great session working on our new project. #coding #nextjs",
// 		createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
// 		likes: 24,
// 		retweets: 5,
// 		replies: 3,
// 		author: {
// 			id: "2",
// 			name: "Jane Smith",
// 			username: "janesmith",
// 			profileImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
// 		},
// 	},
// 	{
// 		id: "2",
// 		content:
// 			"Check out this amazing sunset I captured yesterday evening! #photography #sunset",
// 		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
// 		likes: 152,
// 		retweets: 28,
// 		replies: 12,
// 		media: [
// 			{
// 				type: "image" as const,
// 				url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
// 			},
// 		],
// 		author: {
// 			id: "3",
// 			name: "Alex Johnson",
// 			username: "alexj",
// 			profileImageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
// 		},
// 	},
// 	{
// 		id: "3",
// 		content:
// 			"Just published my new article on web development best practices. Would love to hear your thoughts!",
// 		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
// 		likes: 87,
// 		retweets: 14,
// 		replies: 23,
// 		author: {
// 			id: "4",
// 			name: "Maria Garcia",
// 			username: "mariagarcia",
// 			profileImageUrl: "https://randomuser.me/api/portraits/women/29.jpg",
// 		},
// 	},
// 	{
// 		id: "4",
// 		content:
// 			"Excited to announce that I'll be speaking at the upcoming Tech Conference in San Francisco next month!",
// 		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
// 		likes: 245,
// 		retweets: 56,
// 		replies: 32,
// 		author: {
// 			id: "5",
// 			name: "David Wilson",
// 			username: "davidw",
// 			profileImageUrl: "https://randomuser.me/api/portraits/men/46.jpg",
// 		},
// 	},
// ];
//
// export default function HomePage() {
// 	const handleTweet = (content: string, media?: File[]) => {
// 		// In a real application, this would send the tweet to your backend
// 		console.log("New tweet:", { content, media });
// 	};
//
// 	return (
// 		<DefaultLayout>
// 			{/* Header */}
// 			<header className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm z-10 border-b border-gray-200">
// 				<div className="flex justify-between items-center p-4">
// 					<h1 className="text-xl font-bold">Home</h1>
// 					<button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
// 						<Sparkles size={20} />
// 					</button>
// 				</div>
// 			</header>
//
// 			{/* Tweet composer */}
// 			<TweetComposer
// 				profileImageUrl={MOCK_USER.profileImageUrl}
// 				onTweet={handleTweet}
// 			/>
//
"use client";

import React from "react";
import DefaultLayout from "./layouts/DefaultLayout"; // Ensure this path is correct
import TweetComposer from "@/components/TweetComposer/TweetComposer";
import TweetCard from "@/components/TweetCard/TweetCard";
import { Sparkles } from "lucide-react";
import { useAuth } from "./contexts/AuthContext"; // Ensure this path is correct
import Link from "next/link";

// Mock data for demonstration (replace with your actual data fetching)
const MOCK_USER = {
	id: "1",
	name: "John Doe",
	username: "johndoe",
	profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg", // Default profile image
};

const MOCK_TWEETS = [
	{
		id: "1",
		content:
			"Just had a great session working on our new project. #coding #nextjs",
		createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
		likes: 24,
		retweets: 5,
		replies: 3,
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
		likes: 152,
		retweets: 28,
		replies: 12,
		media: [
			{
				type: "image" as const,
				url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
			},
		],
		author: {
			id: "3",
			name: "Alex Johnson",
			username: "alexj",
			profileImageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
		},
	},
	// Add more mock tweets as needed
];

export default function HomePage() {
	const { currentUser, logout, loading, isAuthenticated } = useAuth();

	const handleTweet = (content: string, media?: File[]) => {
		if (!isAuthenticated) {
			alert("Please log in or sign up to tweet.");
			// Optionally, you could redirect to login: router.push('/login');
			return;
		}
		// In a real application, this would send the tweet to your backend
		console.log("New tweet:", { content, media, user: currentUser });
		// Add logic to actually post the tweet and update the feed
	};

	return (
		<DefaultLayout>
			{/* Header */}
			<header className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm z-10 border-b border-gray-200">
				<div className="flex justify-between items-center p-4">
					<Link href="/" legacyBehavior>
						<a className="text-xl font-bold">Home</a>
					</Link>
					<div className="flex items-center space-x-2 sm:space-x-4">
						{loading ? (
							<span className="text-sm text-gray-500">Loading...</span>
						) : isAuthenticated && currentUser ? (
							<>
								<span className="hidden sm:inline text-sm sm:text-base">
									@{currentUser.username}
								</span>
								<button
									onClick={logout}
									className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base"
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link href="/login" legacyBehavior>
									<a className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base">
										Login
									</a>
								</Link>
								<Link href="/signup" legacyBehavior>
									<a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base">
										Sign Up
									</a>
								</Link>
							</>
						)}
						{/* The Sparkles button from your original UI. Adjust its visibility or purpose as needed. */}
						<button className="text-blue-500 hover:bg-blue-50 p-1 sm:p-2 rounded-full">
							<Sparkles size={20} />
						</button>
					</div>
				</div>
			</header>

			{/* Tweet composer */}
			{isAuthenticated && currentUser ? (
				<TweetComposer
					profileImageUrl={
						currentUser.profileImageUrl || MOCK_USER.profileImageUrl
					} // Use actual user image or fallback
					onTweet={handleTweet}
				/>
			) : (
				<div className="p-4 border-b border-gray-200 text-center bg-gray-50">
					<p>
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

			{/* Timeline of tweets */}
			<div className="divide-y divide-gray-200">
				{MOCK_TWEETS.map((tweet) => (
					<TweetCard key={tweet.id} tweet={tweet} />
				))}
				{/* Placeholder for actual tweet fetching logic */}
				{MOCK_TWEETS.length === 0 && (
					<div className="p-8 text-center text-gray-500">
						<p>No tweets to show right now.</p>
						{!isAuthenticated && <p>Log in or sign up to see more content!</p>}
					</div>
				)}
			</div>
		</DefaultLayout>
	);
}
