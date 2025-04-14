"use client";
import React from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import TweetComposer from "@/components/TweetComposer/TweetComposer";
import TweetCard from "@/components/TweetCard/TweetCard";
import { Sparkles } from "lucide-react";

// Mock data for demonstration
const MOCK_USER = {
	id: "1",
	name: "John Doe",
	username: "johndoe",
	profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
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
				type: "image",
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
	{
		id: "3",
		content:
			"Just published my new article on web development best practices. Would love to hear your thoughts!",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
		likes: 87,
		retweets: 14,
		replies: 23,
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
		likes: 245,
		retweets: 56,
		replies: 32,
		author: {
			id: "5",
			name: "David Wilson",
			username: "davidw",
			profileImageUrl: "https://randomuser.me/api/portraits/men/46.jpg",
		},
	},
];

export default function HomePage() {
	const handleTweet = (content: string, media?: File[]) => {
		// In a real application, this would send the tweet to your backend
		console.log("New tweet:", { content, media });
	};

	return (
		<DefaultLayout>
			{/* Header */}
			<header className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm z-10 border-b border-gray-200">
				<div className="flex justify-between items-center p-4">
					<h1 className="text-xl font-bold">Home</h1>
					<button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
						<Sparkles size={20} />
					</button>
				</div>
			</header>

			{/* Tweet composer */}
			<TweetComposer
				profileImageUrl={MOCK_USER.profileImageUrl}
				onTweet={handleTweet}
			/>

			{/* Timeline of tweets */}
			<div className="divide-y divide-gray-200">
				{MOCK_TWEETS.map((tweet) => (
					<TweetCard key={tweet.id} tweet={tweet} />
				))}
			</div>
		</DefaultLayout>
	);
}
