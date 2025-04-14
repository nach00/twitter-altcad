import React from "react";
import Link from "next/link";
import { Home, Bell, Mail, User, Search, Hash } from "lucide-react";

export default function SidebarNavigation() {
	return (
		<div className="flex flex-col h-full p-4 w-full">
			{/* Logo */}
			<div className="mb-6 p-2">
				<Link href="/">
					<div className="w-8 h-8 text-blue-500">
						{/* Logo placeholder */}
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
						</svg>
					</div>
				</Link>
			</div>

			{/* Navigation links */}
			<nav className="space-y-2 flex-1">
				<NavItem href="/" icon={<Home size={24} />} label="Home" />
				<NavItem href="/explore" icon={<Hash size={24} />} label="Explore" />
				<NavItem
					href="/notifications"
					icon={<Bell size={24} />}
					label="Notifications"
				/>
				<NavItem href="/messages" icon={<Mail size={24} />} label="Messages" />
				<NavItem href="/profile" icon={<User size={24} />} label="Profile" />
			</nav>

			{/* Profile section */}
			<div className="mt-auto pt-4 border-t border-gray-200">
				{/* User profile info/logout button can go here */}
			</div>
		</div>
	);
}

function NavItem({
	href,
	icon,
	label,
}: {
	href: string;
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<Link
			href={href}
			className="flex items-center p-3 rounded-full hover:bg-gray-100 transition-colors"
		>
			<span className="mr-4">{icon}</span>
			<span className="text-lg font-medium">{label}</span>
		</Link>
	);
}
