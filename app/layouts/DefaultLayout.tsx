import React from "react";
import SidebarNavigation from "@/components/Navigation/SidebarNavigation";
import BottomNavigation from "@/components/Navigation/BottomNavigation";

interface DefaultLayoutProps {
	children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
	return (
		<div className="flex min-h-screen">
			{/* Sidebar - hidden on mobile */}
			<div className="hidden md:flex md:w-64 lg:w-72 border-r border-gray-200 h-screen sticky top-0">
				<SidebarNavigation />
			</div>

			{/* Main content */}
			<div className="flex-1 min-h-screen">
				<div className="max-w-2xl mx-auto">{children}</div>
			</div>

			{/* Right sidebar - visible only on larger screens */}
			<div className="hidden lg:block w-80 border-l border-gray-200 h-screen sticky top-0">
				{/* Trending topics, who to follow, etc. */}
			</div>

			{/* Bottom navigation - visible only on mobile */}
			<div className="fixed bottom-0 left-0 right-0 md:hidden border-t border-gray-200 bg-white z-10">
				<BottomNavigation />
			</div>
		</div>
	);
}
