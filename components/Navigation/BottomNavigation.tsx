import React from "react";
import Link from "next/link";
import { Home, Search, Bell, Mail, User } from "lucide-react";

export default function BottomNavigation() {
	return (
		<div className="flex justify-around items-center h-16 bg-white">
			<NavItem href="/" icon={<Home size={24} />} />
			<NavItem href="/explore" icon={<Search size={24} />} />
			<NavItem href="/notifications" icon={<Bell size={24} />} />
			<NavItem href="/messages" icon={<Mail size={24} />} />
			<NavItem href="/profile" icon={<User size={24} />} />
		</div>
	);
}

function NavItem({ href, icon }: { href: string; icon: React.ReactNode }) {
	return (
		<Link
			href={href}
			className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
		>
			{icon}
		</Link>
	);
}
