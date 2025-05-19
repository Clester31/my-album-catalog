/* eslint-disable @next/next/no-img-element */
import { Album, CatalogItem } from "@/app/types/types";
import StarRating from "@/app/components/StarRating";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { User } from "firebase/auth";
import { addAlbumToCatalog } from "@/app/app";
import { useAuth } from "@/app/context/AuthContext";

interface AlbumInfoProps {
    album: Album | null;
    hideDisplay: (value: boolean) => void;
    user: User | null;
}

export default function AlbumInfo({ album, hideDisplay }: AlbumInfoProps) {
    const [albumRating, setAlbumRating] = useState<number>(0);
    const [trackRatings, setTrackRatings] = useState<number[]>(
        album?.tracks.map(() => 0) || []
    );
    const [albumReview, setAlbumReview] = useState<string>("");
    const [dateListened, setDateListened] = useState<string>("");

    const [showTracklist, setShowTracklist] = useState<boolean>(false);
    const [hoveredTrackIndex, setHoveredTrackIndex] = useState<number | null>(
        null
    );

    const { currentCatalog } = useAuth();

    const handleAlbumRating = (rating: number) => {
        setAlbumRating(rating);
    };

    const handleTrackRating = (index: number, rating: number) => {
        const newTrackRatings = [...trackRatings];
        newTrackRatings[index] = rating;
        setTrackRatings(newTrackRatings);
    };

    const addToCatalog = () => {
        const newCatalogItem: CatalogItem = {
            id: uuidv4(),
            albumInfo: {
                id: album?.id ?? "unknown-id",
                title: album?.title ?? "Unknown Title",
                artist: album?.artist ?? "Unknown Artist",
                cover: album?.cover ?? "/noimage.png",
                rating: albumRating || 0,
                review: albumReview || "",
                dateListened: dateListened || "01-01-2025",
                tracks:
                    album?.tracks?.map((track, index) => ({
                        albumId: album?.id ?? "unknown-id",
                        title: track.title ?? "Unknown Track",
                        duration: track.duration ?? 0,
                        trackRating: trackRatings[index] ?? 0,
                    })) ?? [],
            },
            dateAdded: new Date().toISOString(),
            catalogId: currentCatalog || "",
        };
        addAlbumToCatalog(newCatalogItem);
        hideDisplay(false);
    };

    function setTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    }

    return (
        <div className="flex flex-col mt-2 flex overflow-x-hidden items-center gap-4 h-[calc(100vh-160px)]">
            <div className="flex flex-row justify-end w-full mr-16">
                <button
                    className="bg-red-600 hover:bg-red-400 transition 150 ease-in-out text-white px-4 rounded cursor-pointer py-1 text-lg rounded-4xl border-2 border-gray-300 items-center"
                    onClick={() => hideDisplay(false)}
                >
                    Close
                </button>
            </div>
            <div className="overflow-y-auto w-full h-full flex flex-col items-center gap-4">
                <div className="flex flex-col items-center border-b-1 border-gray-200 pb-4 w-5/6">
                    <h1 className="text-lg font-semibold">{album?.title}</h1>
                    <h2 className="text-gray-200">{album?.artist}</h2>
                    <img
                        src={album?.cover || "/noimage.png"}
                        alt="Album Cover"
                        className="w-40"
                    />
                </div>
                <div className="flex flex-col items-center border-b-1 border-gray-200 pb-4 w-5/6 gap-2">
                    <h1 className="font-semibold text-lg">Album Rating</h1>
                    <StarRating
                        maxRating={10}
                        color={"#193cb8"}
                        size={36}
                        onSetRating={handleAlbumRating}
                    />
                </div>
                <div className="flex flex-col items-center border-b-1 border-gray-200 pb-4 w-5/6">
                    <button
                        className="w-3/4 bg-white text-black rounded hover:text-blue-800 transition 150 ease-in-out cursor-pointer px-4 py-1 rounded-4xl border-2 border-gray-200"
                        onClick={() => setShowTracklist(!showTracklist)}
                    >
                        {showTracklist ? "Hide Tracklist" : "Show Tracklist"}
                    </button>
                    {showTracklist && (
                        <div
                            className="flex flex-col items-center w-full overflow-y-auto overflow-x-hidden mt-4"
                            onMouseLeave={() => setHoveredTrackIndex(null)}
                        >
                            {album?.tracks.map((track, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-row justify-between w-full p-1 border-gray-200 border-2 transition-300 bg-white my-2 px-4 rounded-4xl"
                                    >
                                        {hoveredTrackIndex === index ? (
                                            <div className="h-8 opacity-0 hover:opacity-100 transition 150 ease-in-out gap-">
                                                <StarRating
                                                    maxRating={10}
                                                    size={28}
                                                    color={"#193cb8"}
                                                    defaultRating={trackRatings[index]}
                                                    onSetRating={(rating: number) =>
                                                        handleTrackRating(index, rating)
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="h-8 flex flex-row justify-between w-full opacity-100 hover:opacity-0 transition 300 ease-in-out"
                                                onMouseEnter={() => setHoveredTrackIndex(index)}
                                                onMouseLeave={() => setHoveredTrackIndex(null)} 
                                            >
                                                <h1 className="truncate w-3/4 text-md">
                                                    {track.title}
                                                </h1>
                                                <h2 className="w-1/4 text-right text-md">
                                                    {setTime(Number(track.duration))}
                                                </h2>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-center border-b-1 border-gray-200 pb-4 w-5/6 gap-4">
                    <h1 className="font-semibold text-lg">Review</h1>
                    <textarea
                        className="w-full h-36 bg-white text-black rounded-4xl p-4 resize-none border-2 border-gray-200"
                        placeholder="Write your review here (250 characters max)"
                        maxLength={250}
                        onChange={(e) => setAlbumReview(e.target.value)}
                    ></textarea>
                </div>
                <div className="flex flex-col items-center border-b-1 border-gray-200 px-4 py-2 w-5/6 gap-4">
                    <h1 className="font-semibold text-lg">Date Listened</h1>
                    <input
                        type="date"
                        className="w-full bg-white text-black rounded py-2 px-4 rounded-4xl border-2 border-gray-200"
                        onChange={(e) => setDateListened(e.target.value)}
                    />
                </div>
                <div>
                    <button
                        className="px-4 py-2 w-max text-xl text-white bg-blue-800 rounded-4xl items-center mb-16 mt-4 hover:bg-blue-600 transition 150 ease-in-out cursor-pointer"
                        onClick={() => addToCatalog()}
                    >
                        Add to Catalog
                    </button>
                </div>
            </div>
        </div>
    );
}