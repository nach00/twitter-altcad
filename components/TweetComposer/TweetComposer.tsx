import React, { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, BarChart2, Smile, Calendar } from "lucide-react";

interface TweetComposerProps {
	profileImageUrl: string;
	onTweet?: (content: string, media?: File[]) => void;
}

export default function TweetComposer({
	profileImageUrl,
	onTweet,
}: TweetComposerProps) {
	const [content, setContent] = useState("");
	const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!content.trim() && selectedMedia.length === 0) return;

		setIsSubmitting(true);

		try {
			// Call onTweet callback function if provided
			//
			if (onTweet) {
				await onTweet(content, selectedMedia);
			}

			// Reset form
			setContent("");
			setSelectedMedia([]);
		} catch (error) {
			console.error("Error posting tweet:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setSelectedMedia(Array.from(e.target.files));
		}
	};

	return (
		<div className="p-4 border-b border-gray-200">
			<form onSubmit={handleSubmit}>
				<div className="flex space-x-3">
					{/* User profile image */}
					<div className="flex-shrink-0">
						<Image
							src={profileImageUrl}
							alt="Your profile"
							width={48}
							height={48}
							className="rounded-full"
						/>
					</div>

					{/* Tweet input area */}
					<div className="flex-1">
						<textarea
							placeholder="What's happening?"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="w-full border-0 focus:ring-0 text-lg placeholder-gray-500 tracking-wide min-h-[50px] max-h-[200px] resize-none"
							rows={2}
						/>

						{/* Media preview (if uploaded) */}
						{selectedMedia.length > 0 && (
							<div className="mt-2 relative rounded-2xl overflow-hidden border border-gray-200">
								{selectedMedia[0].type.startsWith("image/") ? (
									<Image
										src={URL.createObjectURL(selectedMedia[0])}
										alt="Upload preview"
										width={500}
										height={300}
										className="w-full object-cover"
									/>
								) : null}
								<button
									type="button"
									className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white rounded-full p-1"
									onClick={() => setSelectedMedia([])}
								>
									&times;
								</button>
							</div>
						)}

						{/* Action bar and Tweet button */}
						<div className="flex justify-between items-center mt-3">
							<div className="flex space-x-4 text-blue-500">
								<label className="cursor-pointer">
									<ImageIcon size={20} />
									<input
										type="file"
										className="hidden"
										onChange={handleFileChange}
										accept="image/*,video/*"
									/>
								</label>
								<button type="button">
									<BarChart2 size={20} />
								</button>
								<button type="button">
									<Smile size={20} />
								</button>
								<button type="button">
									<Calendar size={20} />
								</button>
							</div>
							<button
								type="submit"
								disabled={
									(!content.trim() && selectedMedia.length === 0) ||
									isSubmitting
								}
								className="bg-blue-500 text-white px-4 py-1.5 rounded-full font-bold disabled:opacity-50"
							>
								Tweet
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
