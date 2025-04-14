import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
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
			// Add other allowed hostnames here if needed
		],
	},
};

export default nextConfig;
