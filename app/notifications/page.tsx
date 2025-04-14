import React from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DefaultLayout from "../layouts/DefaultLayout";

// Mock data for notifications
const NOTIFICATIONS = [
	{
		id: "1",
		type: "like",
		createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
		user: {
			id: "2",
			name: "Jane Smith",
			username: "janesmith",
			profileImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
		},
		tweet: {
			id: "t1",
			content:
				"Just had a great session working on our new project. #coding #nextjs",
		},
	},
	{
		id: "2",
		type: "retweet",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
		user: {
			id: "3",
			name: "Alex Johnson",
			username: "alexj",
			profileImageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
		},
		tweet: {
			id: "t2",
			content:
				"Check out this amazing sunset I captured yesterday evening! #photography #sunset",
		},
	},
	{
		id: "3",
		type: "follow",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
		user: {
			id: "4",
			name: "Maria Garcia",
			username: "mariagarcia",
			profileImageUrl: "https://randomuser.me/api/portraits/women/29.jpg",
		},
	},
	{
		id: "4",
		type: "mention",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
		user: {
			id: "5",
			name: "David Wilson",
			username: "davidw",
			profileImageUrl: "https://randomuser.me/api/portraits/men/46.jpg",
		},
		tweet: {
			id: "t3",
			content:
				"Hey @johndoe, what do you think about the new React 18 features?",
		},
	},
];

export default function NotificationsPage() {
	return (
		<DefaultLayout>
			{/* Header */}
			<header className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm z-10 border-b border-gray-200">
				<div className="flex items-center p-4">
					<Link href="/" className="mr-4">
						<ArrowLeft size={20} />
					</Link>
					<h1 className="font-bold text-xl">Notifications</h1>
				</div>

				{/* Tabs */}
				<div className="flex border-b border-gray-200">
					<button className="flex-1 py-3 font-bold text-blue-500 border-b-2 border-blue-500">
						All
					</button>
					<button className="flex-1 py-3 text-gray-500">Mentions</button>
				</div>
			</header>

			{/* Notifications list */}
			<div className="divide-y divide-gray-200">
				{NOTIFICATIONS.map((notification) => (
					<div key={notification.id} className="p-4 hover:bg-gray-50">
						<div className="flex space-x-3">
							<div className="flex-shrink-0">
								<Image
									src={notification.user.profileImageUrl}
									alt={notification.user.name}
									width={40}
									height={40}
									className="rounded-full"
								/>
							</div>

							<div>
								{notification.type === "like" && (
									<p>
										<span className="font-bold">{notification.user.name}</span>
										<span className="text-gray-500"> liked your Tweet</span>
									</p>
								)}

								{notification.type === "retweet" && (
									<p>
										<span className="font-bold">{notification.user.name}</span>
										<span className="text-gray-500"> retweeted your Tweet</span>
									</p>
								)}

								{notification.type === "follow" && (
									<p>
										<span className="font-bold">{notification.user.name}</span>
										<span className="text-gray-500"> followed you</span>
									</p>
								)}

								{notification.type === "mention" && (
									<p>
										<span className="font-bold">{notification.user.name}</span>
										<span className="text-gray-500">
											{" "}
											mentioned you in a Tweet
										</span>
									</p>
								)}

								{notification.tweet && (
									<p className="mt-1 text-gray-800">
										"
										{notification.tweet.content.length > 60
											? notification.tweet.content.substring(0, 60) + "..."
											: notification.tweet.content}
										"
									</p>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</DefaultLayout>
	);
}
