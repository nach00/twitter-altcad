import React from "react";
import Image from "next/image";
import { Calendar, MapPin, Link as LinkIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DefaultLayout from "../layouts/DefaultLayout";
import TweetCard from "../../components/TweetCard/TweetCard";

// Mock data for demonstration
const MOCK_PROFILE = {
	id: "1",
	name: "John Doe",
	username: "johndoe",
	profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
	bannerImageUrl:
		"https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
	bio: "Software developer | Next.js enthusiast | Building things for the web",
	location: "San Francisco, CA",
	website: "https://example.com",
	joinedDate: "September 2021",
	following: 243,
	followers: 467,
};

const MOCK_TWEETS = [
	{
		id: "1",
		content: "Just pushed a new update to my portfolio website. Check it out!",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
		likes: 32,
		retweets: 8,
		replies: 4,
		author: MOCK_PROFILE,
	},
	{
		id: "2",
		content:
			"Learning more about React Server Components today. The future of React looks promising!",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
		likes: 45,
		retweets: 12,
		replies: 6,
		author: MOCK_PROFILE,
	},
	{
		id: "3",
		content:
			"Excited to be part of the dev community. Always learning, always building!",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
		likes: 78,
		retweets: 23,
		replies: 9,
		author: MOCK_PROFILE,
	},
];

export default function ProfilePage() {
	return (
		<DefaultLayout>
			{/* Header */}
			<header className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm z-10 border-b border-gray-200">
				<div className="flex items-center p-4">
					<Link href="/" className="mr-4">
						<ArrowLeft size={20} />
					</Link>
					<div>
						<h1 className="font-bold text-xl">{MOCK_PROFILE.name}</h1>
						<p className="text-sm text-gray-500">{MOCK_TWEETS.length} Tweets</p>
					</div>
				</div>
			</header>

			{/* Profile banner */}
			<div className="h-48 relative">
				<Image
					src={MOCK_PROFILE.bannerImageUrl}
					alt="Profile banner"
					fill
					className="object-cover"
					priority
				/>
			</div>

			{/* Profile information */}
			<div className="px-4 pb-4 relative">
				{/* Profile image */}
				<div className="absolute -top-16 left-4 border-4 border-white rounded-full">
					<Image
						src={MOCK_PROFILE.profileImageUrl}
						alt={MOCK_PROFILE.name}
						width={128}
						height={128}
						className="rounded-full"
					/>
				</div>

				{/* Edit profile button */}
				<div className="flex justify-end mt-3">
					<button className="border border-gray-300 rounded-full px-4 py-1.5 font-bold hover:bg-gray-50">
						Edit profile
					</button>
				</div>

				{/* Profile details */}
				<div className="mt-6">
					<h1 className="font-bold text-xl">{MOCK_PROFILE.name}</h1>
					<p className="text-gray-500">@{MOCK_PROFILE.username}</p>
					<p className="mt-3">{MOCK_PROFILE.bio}</p>

					<div className="flex flex-wrap gap-x-4 mt-3 text-gray-500 text-sm">
						{MOCK_PROFILE.location && (
							<div className="flex items-center">
								<MapPin size={16} className="mr-1" />
								<span>{MOCK_PROFILE.location}</span>
							</div>
						)}
						{MOCK_PROFILE.website && (
							<div className="flex items-center">
								<LinkIcon size={16} className="mr-1" />
								<a
									href={MOCK_PROFILE.website}
									className="text-blue-500 hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									{MOCK_PROFILE.website.replace(/^https?:\/\//, "")}
								</a>
							</div>
						)}
						<div className="flex items-center">
							<Calendar size={16} className="mr-1" />
							<span>Joined {MOCK_PROFILE.joinedDate}</span>
						</div>
					</div>

					<div className="flex space-x-4 mt-3">
						<div>
							<span className="font-bold">{MOCK_PROFILE.following}</span>
							<span className="text-gray-500 ml-1">Following</span>
						</div>
						<div>
							<span className="font-bold">{MOCK_PROFILE.followers}</span>
							<span className="text-gray-500 ml-1">Followers</span>
						</div>
					</div>
				</div>

				{/* Tab navigation */}
				<div className="flex border-b border-gray-200 mt-4">
					<button className="flex-1 py-4 font-bold text-blue-500 border-b-2 border-blue-500">
						Tweets
					</button>
					<button className="flex-1 py-4 text-gray-500">Replies</button>
					<button className="flex-1 py-4 text-gray-500">Media</button>
					<button className="flex-1 py-4 text-gray-500">Likes</button>
				</div>
			</div>

			{/* User's tweets */}
			<div className="divide-y divide-gray-200">
				{MOCK_TWEETS.map((tweet) => (
					<TweetCard key={tweet.id} tweet={tweet} />
				))}
			</div>
		</DefaultLayout>
	);
}
