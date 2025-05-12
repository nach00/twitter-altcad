import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "randomuser.me",
				pathname: "/api/portraits/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**", // Allow any path from this hostname
			},
		],
	},
};

export default nextConfig;
