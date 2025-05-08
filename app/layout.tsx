// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
//
// const geistSans = Geist({
// 	variable: "--font-geist-sans",
// 	subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });
//
// export const metadata: Metadata = {
// 	title: "TwitterClone",
// 	description: "A modern Twitter clone built with Next.js",
// };
//
// export default function RootLayout({
// 	children,
// }: Readonly<{
// 	children: React.ReactNode;
// }>) {
// 	return (
// 		<html lang="en">
// 			<body
// 				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
// 			>
// 				<div className="flex min-h-screen flex-col">
// 					<main className="flex-1">{children}</main>
// 				</div>
// 			</body>
// 		</html>
// 	);
// }
"use client";

import "./globals.css";
import React, { ReactNode } from "react";
import { AuthProvider } from "./contexts/AuthContext";

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<body>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
