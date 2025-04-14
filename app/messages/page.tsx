import React from "react";
import Image from "next/image";
import { ArrowLeft, MessageSquarePlus, Search } from "lucide-react";
import Link from "next/link";
import DefaultLayout from "../layouts/DefaultLayout";

// Mock conversations data
const CONVERSATIONS = [
	{
		id: "1",
		recipient: {
			id: "2",
			name: "Jane Smith",
			username: "janesmith",
			profileImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
		},
		lastMessage: {
			id: "m1",
			content: "Hey, did you check out the project I sent you?",
			sentAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
			isRead: true,
		},
	},
	{
		id: "2",
		recipient: {
			id: "3",
			name: "Alex Johnson",
			username: "alexj",
			profileImageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
		},
		lastMessage: {
			id: "m2",
			content: "Looking forward to our meeting tomorrow!",
			sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
			isRead: false,
		},
	},
	{
		id: "3",
		recipient: {
			id: "4",
			name: "Maria Garcia",
			username: "mariagarcia",
			profileImageUrl: "https://randomuser.me/api/portraits/women/29.jpg",
		},
		lastMessage: {
			id: "m3",
			content: "Can you share more details about the conference?",
			sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
			isRead: true,
		},
	},
	{
		id: "4",
		recipient: {
			id: "5",
			name: "David Wilson",
			username: "davidw",
			profileImageUrl: "https://randomuser.me/api/portraits/men/46.jpg",
		},
		lastMessage: {
			id: "m4",
			content: "Thanks for the feedback on my presentation!",
			sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
			isRead: true,
		},
	},
];

// Helper function to format date for messages
const formatMessageDate = (dateString) => {
	const date = new Date(dateString);
	const now = new Date();

	// If today, return time
	if (date.toDateString() === now.toDateString()) {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}

	// If this year, return month and day
	if (date.getFullYear() === now.getFullYear()) {
		return date.toLocaleDateString([], { month: "short", day: "numeric" });
	}

	// Otherwise return full date
	return date.toLocaleDateString([], {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

export default function MessagesPage() {
	return (
		<DefaultLayout>
			{/* Header */}
			<header className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm z-10 border-b border-gray-200">
				<div className="flex justify-between items-center p-4">
					<div className="flex items-center">
						<Link href="/" className="mr-4">
							<ArrowLeft size={20} />
						</Link>
						<h1 className="font-bold text-xl">Messages</h1>
					</div>
					<button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
						<MessageSquarePlus size={20} />
					</button>
				</div>
			</header>

			{/* Search bar */}
			<div className="p-4">
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search size={16} className="text-gray-400" />
					</div>
					<input
						type="text"
						placeholder="Search Direct Messages"
						className="bg-gray-100 w-full pl-10 pr-4 py-2 rounded-full border-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
					/>
				</div>
			</div>

			{/* Conversations list */}
			<div className="divide-y divide-gray-200">
				{CONVERSATIONS.map((conversation) => (
					<div
						key={conversation.id}
						className="p-4 hover:bg-gray-50 cursor-pointer"
					>
						<div className="flex space-x-3">
							<div className="flex-shrink-0">
								<Image
									src={conversation.recipient.profileImageUrl}
									alt={conversation.recipient.name}
									width={48}
									height={48}
									className="rounded-full"
								/>
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex justify-between">
									<div>
										<span className="font-bold">
											{conversation.recipient.name}
										</span>
										<span className="text-gray-500 ml-1">
											@{conversation.recipient.username}
										</span>
									</div>
									<span className="text-gray-500 text-sm">
										{formatMessageDate(conversation.lastMessage.sentAt)}
									</span>
								</div>

								<p
									className={`mt-1 truncate ${!conversation.lastMessage.isRead ? "font-semibold" : "text-gray-500"}`}
								>
									{conversation.lastMessage.content}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</DefaultLayout>
	);
}
