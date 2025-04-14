import React from "react";
import Image from "next/image";
import { Heart, MessageCircle, Repeat, Share } from "lucide-react";

interface TweetCardProps {
	tweet: {
		id: string;
		content: string;
		createdAt: string;
		likes: number;
		retweets: number;
		replies: number;
		media?: {
			type: "image" | "video";
			url: string;
		}[];
		author: {
			id: string;
			name: string;
			username: string;
			profileImageUrl: string;
		};
	};
}

export default function TweetCard({ tweet }: TweetCardProps) {
	// Function to format the date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) {
			return `${diffInSeconds}s`;
		} else if (diffInSeconds < 3600) {
			return `${Math.floor(diffInSeconds / 60)}m`;
		} else if (diffInSeconds < 86400) {
			return `${Math.floor(diffInSeconds / 3600)}h`;
		} else {
			return date.toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
			});
		}
	};

	return (
		<article className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
			<div className="flex space-x-3">
				{/* Author profile image */}
				<div className="flex-shrink-0">
					<Image
						src={tweet.author.profileImageUrl}
						alt={tweet.author.name}
						width={48}
						height={48}
						className="rounded-full"
					/>
				</div>

				{/* Tweet content */}
				<div className="flex-1 min-w-0">
					{/* Author info and timestamp */}
					<div className="flex items-center text-sm">
						<span className="font-bold">{tweet.author.name}</span>
						<span className="text-gray-500 ml-1">@{tweet.author.username}</span>
						<span className="text-gray-500 mx-1">·</span>
						<span className="text-gray-500">{formatDate(tweet.createdAt)}</span>
					</div>

					{/* Tweet text */}
					<p className="mt-1 text-gray-900">{tweet.content}</p>

					{/* Tweet media (if any) */}
					{tweet.media && tweet.media.length > 0 && (
						<div className="mt-3 rounded-xl overflow-hidden">
							{tweet.media[0].type === "image" ? (
								<Image
									src={tweet.media[0].url}
									alt="Tweet media"
									width={500}
									height={300}
									className="w-full object-cover"
								/>
							) : (
								<video src={tweet.media[0].url} controls className="w-full" />
							)}
						</div>
					)}

					{/* Tweet actions */}
					<div className="mt-3 flex justify-between max-w-md">
						<button className="flex items-center text-gray-500 hover:text-blue-500">
							<MessageCircle size={18} className="mr-1" />
							<span className="text-sm">{tweet.replies}</span>
						</button>
						<button className="flex items-center text-gray-500 hover:text-green-500">
							<Repeat size={18} className="mr-1" />
							<span className="text-sm">{tweet.retweets}</span>
						</button>
						<button className="flex items-center text-gray-500 hover:text-red-500">
							<Heart size={18} className="mr-1" />
							<span className="text-sm">{tweet.likes}</span>
						</button>
						<button className="flex items-center text-gray-500 hover:text-blue-500">
							<Share size={18} />
						</button>
					</div>
				</div>
			</div>
		</article>
	);
}
