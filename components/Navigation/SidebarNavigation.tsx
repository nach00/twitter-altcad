// ~/github/twitter-altcad/components/Navigation/SidebarNavigation.tsx

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // For logout icon and potentially user profile pic
import { Home, Bell, Mail, User, Hash, LogOut } from "lucide-react"; // Added LogOut
import { useAuth } from "../../app/contexts/AuthContext"; // Assuming this is the correct path
import { useRouter } from "next/navigation"; // For redirecting after logout

// Define the structure for individual navigation items
interface NavItemProps {
	href: string;
	icon: React.ReactNode;
	label: string;
	isActive?: boolean; // Optional: for highlighting active link
	onClick?: () => void; // Optional: for actions like logout
}

const NavItem: React.FC<NavItemProps> = ({
	href,
	icon,
	label,
	isActive,
	onClick,
}) => {
	const itemClasses = `flex items-center p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 ${
		isActive ? "bg-gray-100 dark:bg-gray-700 font-semibold" : ""
	}`;

	if (onClick) {
		return (
			<button onClick={onClick} className={`${itemClasses} w-full`}>
				<span className="mr-4">{icon}</span>
				<span className="text-lg">{label}</span>
			</button>
		);
	}

	return (
		<Link href={href} className={itemClasses}>
			<span className="mr-4">{icon}</span>
			<span className="text-lg font-medium">{label}</span>
		</Link>
	);
};

export default function SidebarNavigation() {
	const { currentUser, isAuthenticated, logout, loading } = useAuth();
	const router = useRouter();
	// const pathname = usePathname(); // If you need to determine active link

	const handleLogout = () => {
		logout(); // Clears context and localStorage
		router.push("/login"); // Redirect to login page
	};

	let profileHref = "/login"; // Default for profile if not logged in
	if (isAuthenticated && currentUser) {
		profileHref = `/profile/${currentUser.id}`; // Dynamic profile link
	}

	if (loading) {
		return (
			<div className="flex flex-col h-full p-4 w-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
				<div className="mb-6 p-2">
					{/* Logo Placeholder */}
					<div className="w-8 h-8 text-blue-500">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
						</svg>
					</div>
				</div>
				<div className="space-y-2 flex-1">
					<p className="text-gray-500 dark:text-gray-400 p-3">
						Loading user...
					</p>
					{/* You can add skeleton loaders for NavItems here */}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full p-4 w-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
			{/* Logo */}
			<div className="mb-6 p-2">
				<Link href="/">
					<div className="w-8 h-8 text-blue-500 dark:text-blue-400">
						{/* Twitter/X Logo SVG */}
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
						</svg>
					</div>
				</Link>
			</div>

			{/* Navigation links */}
			<nav className="space-y-1 flex-1">
				{" "}
				{/* Reduced space-y for tighter packing */}
				<NavItem href="/" icon={<Home size={24} />} label="Home" />
				<NavItem href="/explore" icon={<Hash size={24} />} label="Explore" />
				<NavItem
					href="/notifications"
					icon={<Bell size={24} />}
					label="Notifications"
				/>
				<NavItem href="/messages" icon={<Mail size={24} />} label="Messages" />
				{/* Dynamic Profile Link */}
				<NavItem href={profileHref} icon={<User size={24} />} label="Profile" />
			</nav>

			{/* Profile section at the bottom */}
			<div className="mt-auto pt-4">
				{" "}
				{/* Removed border for a cleaner look if desired, or use border-gray-200 dark:border-gray-700 */}
				{isAuthenticated && currentUser ? (
					<div className="flex flex-col items-start space-y-3">
						<div className="flex items-center space-x-3 p-2 rounded-lg w-full">
							{currentUser.profileImageUrl ? (
								<Image
									src={currentUser.profileImageUrl}
									alt={currentUser.username || "User"}
									width={40}
									height={40}
									className="rounded-full object-cover"
								/>
							) : (
								<div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white dark:text-gray-300">
									<User size={20} />
								</div>
							)}
							<div>
								<p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
									{currentUser.name || currentUser.username}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									@{currentUser.username}
								</p>
							</div>
						</div>
						<NavItem
							icon={<LogOut size={24} />}
							label="Logout"
							onClick={handleLogout}
							href="#" // href is not used due to onClick
						/>
					</div>
				) : (
					// If not authenticated, show login/signup (optional, or keep this section empty)
					<div className="space-y-1">
						<NavItem href="/login" icon={<User size={24} />} label="Login" />
						{/* You could add a signup NavItem here too if desired */}
					</div>
				)}
			</div>
		</div>
	);
}
