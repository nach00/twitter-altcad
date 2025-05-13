// app/types/tweet.ts

// Define the structure for a Tweet Author
// This can be a simplified version of your main User type,
// or you can import your main User type if it fits.
export interface TweetAuthor {
	id: string; // Or number, depending on your User ID type
	name: string;
	username: string;
	profileImageUrl?: string | null; // Optional
}

// Define the main structure for a Tweet object
export interface Tweet {
	id: string; // Unique identifier for the tweet
	content: string; // The text content of the tweet
	createdAt: string; // ISO string representation of the creation date
	likeCount: number;
	retweetCount: number;
	replyCount: number;
	authorId: string; // ID of the author (foreign key)
	author: TweetAuthor; // Embedded or referenced author information
	mediaUrl?: string | null; // Optional URL for a single media item (image/video)
	// If you plan to support multiple media items:
	// media?: Array<{ type: 'image' | 'video'; url: string }>;
}
