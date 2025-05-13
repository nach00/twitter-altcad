// File: frontend/src/components/cards/TweetCard.tsx
"use client"; // Keep this if it was already there, or add if needed for hooks

import Image from "next/image";
import Link from "next/link";
import { Tweet } from "@/app/types/tweet"; // Assuming this is your Tweet type path
import { MessageCircle, Repeat, Heart, Share } from "lucide-react"; // Assuming icon usage
import TimeAgo from "react-timeago"; // Your existing import
import React, { useState, useEffect } from "react"; // Import useState and useEffect

interface TweetCardProps {
	tweet: Tweet;
	// Add any other props your TweetCard expects
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		// This effect runs only on the client, after the component has mounted
		setIsClient(true);
	}, []);

	// Fallback for profile image if not present
	const profileImageUrl =
		tweet.author?.profileImageUrl || "/assets/default-profile.png"; // Adjust default path as needed

	return (
		<article className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
			<div className="flex space-x-3">
				{/* Author Profile Image */}
				<Link href={`/profile/${tweet.author?.username || tweet.authorId}`}>
					<div className="flex-shrink-0">
						<Image
							src={profileImageUrl}
							alt={`${tweet.author?.name || "User"}'s profile picture`}
							width={48}
							height={48}
							className="rounded-full object-cover"
							onError={(e) => {
								// Fallback if the image fails to load
								(e.target as HTMLImageElement).src =
									"/assets/default-profile.png"; // Adjust default path
							}}
						/>
					</div>
				</Link>

				<div className="flex-1 min-w-0">
					{/* Tweet Header: Author Info & Timestamp */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-1 whitespace-nowrap">
							<Link
								href={`/profile/${tweet.author?.username || tweet.authorId}`}
								className="hover:underline"
							>
								<span className="font-bold text-gray-900 dark:text-white">
									{tweet.author?.name || "Unknown User"}
								</span>
							</Link>
							{tweet.author?.username && (
								<span className="text-sm text-gray-500 dark:text-gray-400">
									@{tweet.author.username}
								</span>
							)}
							<span className="text-sm text-gray-500 dark:text-gray-400">
								·
							</span>
							{/* Conditional rendering for TimeAgo */}
							{isClient ? (
								<TimeAgo
									date={tweet.createdAt}
									className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
									title={new Date(tweet.createdAt).toLocaleString()} // Show full date on hover
								/>
							) : (
								// Placeholder during SSR and initial client render before hydration
								// You can make this a more sophisticated skeleton/placeholder if desired
								<span className="text-sm text-gray-500 dark:text-gray-400">
									&nbsp;
								</span>
							)}
						</div>
						{/* You might have a "more options" button here */}
					</div>

					{/* Tweet Content */}
					{tweet.content && (
						<p className="mt-1 text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-words">
							{tweet.content}
						</p>
					)}

					{/* Tweet Media (Image/Video) - Placeholder for now */}
					{tweet.mediaUrl && (
						<div className="mt-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
							<Image
								src={tweet.mediaUrl}
								alt="Tweet media"
								width={500} // Adjust as needed, or use layout="responsive"
								height={300} // Adjust as needed
								className="w-full object-cover"
							/>
						</div>
					)}

					{/* Tweet Actions: Reply, Retweet, Like, Share */}
					<div className="flex items-center justify-between mt-3 text-gray-500 dark:text-gray-400 max-w-xs">
						<button className="flex items-center space-x-1 hover:text-blue-500 group">
							<MessageCircle
								size={18}
								className="group-hover:bg-blue-100 dark:group-hover:bg-blue-900 rounded-full p-0.5"
							/>
							<span className="text-xs">{tweet.replyCount || 0}</span>
						</button>
						<button className="flex items-center space-x-1 hover:text-green-500 group">
							<Repeat
								size={18}
								className="group-hover:bg-green-100 dark:group-hover:bg-green-900 rounded-full p-0.5"
							/>
							<span className="text-xs">{tweet.retweetCount || 0}</span>
						</button>
						<button className="flex items-center space-x-1 hover:text-red-500 group">
							<Heart
								size={18}
								className="group-hover:bg-red-100 dark:group-hover:bg-red-900 rounded-full p-0.5"
							/>
							<span className="text-xs">{tweet.likeCount || 0}</span>
						</button>
						<button className="hover:text-blue-500 group">
							<Share
								size={18}
								className="group-hover:bg-blue-100 dark:group-hover:bg-blue-900 rounded-full p-0.5"
							/>
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};

export default TweetCard;
