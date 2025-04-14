import React from "react";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="flex min-h-screen">
			{/* Left side - background image or branding */}
			<div className="hidden md:block md:w-1/2 bg-blue-500">
				<div className="flex items-center justify-center h-full">
					{/* Twitter logo or branding */}
					<div className="text-white w-32 h-32">{/* Logo placeholder */}</div>
				</div>
			</div>

			{/* Right side - auth form */}
			<div className="w-full md:w-1/2 flex items-center justify-center">
				{children}
			</div>
		</div>
	);
}
