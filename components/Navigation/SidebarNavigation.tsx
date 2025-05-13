// ~/github/twitter-altcad/components/Navigation/SidebarNavigation.tsx

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
	Home,
	Bell,
	Mail,
	User,
	Hash,
	LogOut,
	LucideProps,
} from "lucide-react";
import { useAuth } from "../../app/contexts/AuthContext"; // Ensure this path is correct
import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation"; // Uncomment to implement active link highlighting

// --- Type Definitions ---

// IMPORTANT: Replace this with your actual User type from app/types/auth.ts or AuthContext
// This is a placeholder based on usage in this component.
interface CurrentUser {
	id: string | number; // Assuming ID can be string or number from your backend
	username: string;
	name?: string | null;
	profileImageUrl?: string | null;
	// Add any other properties your currentUser object might have from AuthContext
}

// Type for the props of each navigation item component
interface NavItemProps {
	href: string;
	icon: React.ReactNode;
	label: string;
	isActive?: boolean;
	onClick?: () => void;
}

// Type for the configuration object of each navigation link
interface NavLinkConfig {
	id: string;
	label: string;
	IconComponent: React.ComponentType<LucideProps>; // Type for Lucide icon components
	href: string;
}

// --- Reusable Components ---

const TwitterLogo: React.FC = () => (
	<div className="w-8 h-8 text-blue-500 dark:text-blue-400">
		<svg viewBox="0 0 24 24" fill="currentColor" aria-label="Twitter logo">
			<path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
		</svg>
	</div>
);

const NavItem: React.FC<NavItemProps> = ({
	href,
	icon,
	label,
	isActive,
	onClick,
}) => {
	const itemClasses = `flex items-center p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 w-full ${
		isActive ? "font-semibold bg-gray-100 dark:bg-gray-700" : "font-medium"
	}`;

	if (onClick) {
		return (
			<button type="button" onClick={onClick} className={itemClasses}>
				<span className="mr-4 shrink-0">{icon}</span>
				<span className="text-lg">{label}</span>
			</button>
		);
	}

	return (
		<Link href={href} className={itemClasses}>
			<span className="mr-4 shrink-0">{icon}</span>
			<span className="text-lg">{label}</span>
		</Link>
	);
};

// --- Helper Function for Navigation Links ---

const getNavLinkConfigs = (
	currentUser: CurrentUser | null,
	isAuthenticated: boolean,
): NavLinkConfig[] => {
	const profileHref =
		isAuthenticated && currentUser ? `/profile/${currentUser.id}` : "/login";

	return [
		{ id: "home", label: "Home", IconComponent: Home, href: "/" },
		{ id: "explore", label: "Explore", IconComponent: Hash, href: "/explore" },
		{
			id: "notifications",
			label: "Notifications",
			IconComponent: Bell,
			href: "/notifications",
		},
		{
			id: "messages",
			label: "Messages",
			IconComponent: Mail,
			href: "/messages",
		},
		{ id: "profile", label: "Profile", IconComponent: User, href: profileHref },
	];
};

// --- Main Sidebar Navigation Component ---

export default function SidebarNavigation() {
	// Ensure useAuth() hook provides typed values, especially currentUser.
	const { currentUser, isAuthenticated, logout, loading } = useAuth();
	const router = useRouter();
	// const pathname = usePathname(); // For active link highlighting

	const handleLogout = () => {
		logout(); // This should clear context and any persisted auth state
		router.push("/login");
	};

	if (loading) {
		return (
			<aside className="flex flex-col h-full p-4 w-full max-w-xs border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
				<div className="mb-6 p-2">
					<TwitterLogo />
				</div>
				<div className="space-y-1 flex-1">
					{[...Array(5)].map((_, index) => (
						<div
							key={index}
							className="h-[52px] rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" // Adjusted for p-3 + icon/text height
						/>
					))}
				</div>
				<div className="mt-auto pt-4">
					<div className="h-[68px] rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />{" "}
					{/* User info + logout skeleton */}
				</div>
			</aside>
		);
	}

	const navLinks = getNavLinkConfigs(currentUser, isAuthenticated);

	return (
		<aside className="flex flex-col h-full p-4 w-full max-w-xs border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
			<div className="mb-6 p-2">
				<Link href="/" aria-label="Home">
					<TwitterLogo />
				</Link>
			</div>

			<nav className="space-y-1 flex-1" aria-label="Main navigation">
				{navLinks.map(({ id, label, IconComponent, href }) => (
					<NavItem
						key={id}
						href={href}
						icon={<IconComponent size={24} aria-hidden="true" />}
						label={label}
						// isActive={pathname === href} // Example for active state
					/>
				))}
			</nav>

			<div className="mt-auto pt-4">
				{isAuthenticated && currentUser ? (
					<div className="flex flex-col items-start space-y-3">
						<Link
							href={`/profile/${currentUser.id}`}
							className="flex items-center space-x-3 p-2 rounded-lg w-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						>
							{currentUser.profileImageUrl ? (
								<Image
									src={currentUser.profileImageUrl}
									alt={`${currentUser.username || "User"}'s profile picture`}
									width={40}
									height={40}
									className="rounded-full object-cover"
								/>
							) : (
								<div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white dark:text-gray-300">
									<User size={20} aria-hidden="true" />
								</div>
							)}
							<div className="overflow-hidden">
								<p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
									{currentUser.name || currentUser.username}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
									@{currentUser.username}
								</p>
							</div>
						</Link>
						<NavItem
							icon={<LogOut size={24} aria-hidden="true" />}
							label="Logout"
							onClick={handleLogout}
							href="#" // href is not used due to onClick, but required by NavItemProps
						/>
					</div>
				) : (
					<div className="space-y-1">
						<NavItem
							href="/login"
							icon={<User size={24} aria-hidden="true" />}
							label="Login"
						/>
						{/* Optional: Add Signup NavItem if desired
            <NavItem
              href="/signup"
              icon={<UserPlus size={24} aria-hidden="true" />} // Example, ensure UserPlus is imported
              label="Sign Up"
            />
            */}
					</div>
				)}
			</div>
		</aside>
	);
}
