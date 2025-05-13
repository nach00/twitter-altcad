// src/app/[username]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";

// The shape of the route parameters AFTER they are resolved from the Promise
interface ResolvedRouteParams {
	username: string;
}

// The props the Page component receives from Next.js
// `params` is a Promise that will resolve to ResolvedRouteParams
interface UserProfilePageServerProps {
	params: Promise<ResolvedRouteParams>;
	// searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // If you use searchParams
}

// Define a generic structure for the profile data this page will display.
interface DisplayableProfileData {
	id: string;
	username: string;
	fullName?: string | null;
	bio?: string | null;
	avatarUrl?: string | null;
	followerCount?: number;
	followingCount?: number;
	joinDate?: string;
}

// --- Mock Data Store and Fetching Logic (remains the same) ---
const MOCK_USER_DATABASE: Record<string, DisplayableProfileData> = {
	alice_wonder: {
		/* ... */ id: "user_001",
		username: "alice_wonder",
		fullName: "Alice Wonderland",
		bio: "Curiouser and curiouser! Exploring the digital rabbit hole.",
		avatarUrl:
			"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=150&h=150&auto=format&fit=crop",
		followerCount: 1250,
		followingCount: 300,
		joinDate: "2022-05-10",
	},
	bob_builder: {
		/* ... */ id: "user_002",
		username: "bob_builder",
		fullName: "Bob The Builder",
		bio: "Can we fix it? Yes, we can! Building cool stuff with code.",
		avatarUrl:
			"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&h=150&auto=format&fit=crop",
		followerCount: 870,
		followingCount: 150,
		joinDate: "2021-11-23",
	},
	charlie_brown: {
		/* ... */ id: "user_003",
		username: "charlie_brown",
		fullName: "Charlie Brown",
		bio: "Good grief! Just trying my best.",
		followerCount: 500,
		followingCount: 50,
		joinDate: "2023-01-15",
	},
};

async function fetchMockUserProfile(
	username: string,
): Promise<DisplayableProfileData | null> {
	await new Promise((resolve) => setTimeout(resolve, Math.random() * 100 + 50));
	const normalizedUsername = username.toLowerCase();
	const user = MOCK_USER_DATABASE[normalizedUsername];
	return user ? { ...user } : null;
}
// --- End Mock Data Store ---

// Server Component - can be async
export default async function UserProfilePage({
	params: paramsPromise,
}: UserProfilePageServerProps) {
	// Await the params Promise to get the resolved parameters
	const resolvedParams: ResolvedRouteParams = await paramsPromise;
	const { username: requestedUsername } = resolvedParams;

	if (
		!requestedUsername ||
		typeof requestedUsername !== "string" ||
		requestedUsername.trim() === ""
	) {
		console.warn(`UserProfilePage: Invalid username: "${requestedUsername}"`);
		notFound();
	}

	const profile: DisplayableProfileData | null =
		await fetchMockUserProfile(requestedUsername);

	if (!profile) {
		console.log(
			`UserProfilePage: Profile not found for "${requestedUsername}".`,
		);
		notFound();
	}

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
				<header className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 mb-8">
					<div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
						{profile.avatarUrl ? (
							<Image
								src={profile.avatarUrl}
								alt={`${profile.fullName || profile.username}'s avatar`}
								width={128}
								height={128}
								className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 flex-shrink-0"
								priority
							/>
						) : (
							<div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-4xl font-semibold flex-shrink-0">
								{(profile.fullName || profile.username)
									.substring(0, 2)
									.toUpperCase()}
							</div>
						)}
						<div className="text-center sm:text-left">
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
								{profile.fullName || profile.username}
							</h1>
							<p className="text-lg text-blue-600 dark:text-blue-400">
								@{profile.username}
							</p>
							{profile.bio && (
								<p className="mt-2 text-md text-gray-700 dark:text-gray-300 max-w-md">
									{profile.bio}
								</p>
							)}
						</div>
					</div>
					<div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-around sm:justify-start sm:space-x-10 text-center sm:text-left">
						<div>
							<p className="text-2xl font-semibold text-gray-900 dark:text-white">
								{profile.followerCount !== undefined
									? profile.followerCount.toLocaleString()
									: "N/A"}
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Followers
							</p>
						</div>
						<div>
							<p className="text-2xl font-semibold text-gray-900 dark:text-white">
								{profile.followingCount !== undefined
									? profile.followingCount.toLocaleString()
									: "N/A"}
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Following
							</p>
						</div>
						{profile.joinDate && (
							<div className="hidden sm:block">
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									Joined
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{new Date(profile.joinDate).toLocaleDateString(undefined, {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
						)}
					</div>
				</header>
				<section className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
					<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
						Activity
					</h2>
					<div className="text-center text-gray-500 dark:text-gray-400 py-12">
						<p className="text-lg">
							This is where {profile.username}s posts or activity would be
							displayed.
						</p>
						<p className="mt-2">(Content placeholder)</p>
					</div>
				</section>
			</main>
		</div>
	);
}

// generateStaticParams should return an array of the *resolved* parameter objects
// Its return type should be `Promise<Array<ResolvedRouteParams>>` or simply `Promise<ResolvedRouteParams[]>`
export async function generateStaticParams(): Promise<
	Array<ResolvedRouteParams>
> {
	const usernamesToPrerender = Object.keys(MOCK_USER_DATABASE);
	if (usernamesToPrerender.length === 0) {
		return [];
	}
	return usernamesToPrerender.map((username) => ({
		username, // This is the ResolvedRouteParams shape
	}));
}
