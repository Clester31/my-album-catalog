/* eslint-disable @next/next/no-img-element */
import { CatalogItem } from "@/app/types/types";
import { useState } from "react";
import { deleteCatalogEntry, updateAlbumRating, updateTrackRating, updateReview } from "@/app/app";

export default function CatalogItemEntry({ item, disableControls }: { item: CatalogItem, disableControls: boolean }) {
    const [showSidePanel, setShowSidePanel] = useState<boolean>(false);
    const [editRating, setEditRating] = useState<boolean>(false);
    const [editTrackRating, setEditTrackRating] = useState<number[]>([0, -1]);
    const [editReview, setEditReview] = useState<boolean>(false);
    const [newRating, setNewRating] = useState<number>(0);
    const [newTrackRating, setNewTrackRating] = useState<number>(0);
    const [newReview, setNewReview] = useState<string>('');
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);

    const changeAlbumRating = () => {
        updateAlbumRating(item.catalogId, item.albumInfo.id, newRating);
        setEditRating(false);
    };

    const changeTrackRating = () => {
        updateTrackRating(item.catalogId, item.albumInfo.id, editTrackRating[1], newTrackRating);
        setEditTrackRating([0, -1]);
    };

    const changeReview = () => {
        updateReview(item.catalogId, item.albumInfo.id, newReview);
        setEditReview(false);
    }

    const removeCatalogEntry = () => {
        deleteCatalogEntry(item.catalogId, item.albumInfo.id);
        setShowDeletePopup(false);
    };

    return (
        <div className="flex flex-row border-2 border-gray-300 rounded-4xl h-64 my-2 bg-white shadow-lg">
            <div className="w-40 px-2">
                <div className="p-2 text-md">
                    <h1
                        className="font-semibold truncate"
                        title={item.albumInfo.title}
                        style={{ whiteSpace: "nowrap" }}
                    >
                        {item.albumInfo.title.length > 18
                            ? `${item.albumInfo.title.slice(0, 18)}...`
                            : item.albumInfo.title}
                    </h1>
                    <h2 className="italic truncate" title={item.albumInfo.artist}>
                        {item.albumInfo.artist.length > 20
                            ? `${item.albumInfo.artist.slice(0, 20)}...`
                            : item.albumInfo.artist}
                    </h2>
                </div>
                <div className="p-2">
                    <img
                        src={item.albumInfo.cover}
                        alt={item.albumInfo.title}
                        className="w-24 h-24 object-cover rounded"
                    />
                </div>
                <div className="flex flex-row gap-2 p-2">
                    {!editRating ? (
                        <div className="flex flex-row gap-2 items-center text-center h-10">
                            <div className="flex flex-row gap-2 items-center bg-white border-2 border-blue-800 w-16 p-1 rounded-lg hover:bg-blue-200 transition-all duration-300 ease-in-out cursor-pointer"
                                title="Click to edit rating"
                                onClick={() => {
                                    if (!disableControls) {
                                        setEditRating(true)
                                    }
                                }}
                            >
                                <i className="fa-solid fa-star text-blue-500 text-lg"></i>
                                <h1 className="text-blue-800 font-bold text-xl">
                                    {item.albumInfo.rating}
                                </h1>
                            </div>
                            {/* <button
                                className="bg-white w-8 h-8 rounded-md text-black cursor-pointer"
                                onClick={() => setEditRating(true)}
                            >
                                <i className="fa-solid fa-pencil"></i>
                            </button> */}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 items-center text-center justify-center h-10">
                            <input
                                min={1}
                                max={10}
                                placeholder="1-10"
                                className="w-16 bg-white text-blue-800 font-semibold text-xl border-2 border-blue-800 rounded-md text-center"
                                type="number"
                                onChange={(e) => setNewRating(Number(e.target.value))}
                            />
                            <button
                                className="bg-blue-800 hover:bg-blue-600 transition 150 ease-in-out text-white w-8 h-8 rounded-md cursor-pointer"
                                onClick={changeAlbumRating}
                            >
                                <i className="fa-solid fa-pencil"></i>
                            </button>
                        </div>
                    )}
                </div>
                <div className="px-2 flex flex-row items-center text-xs text-gray-500">
                    <h1>{item.albumInfo.dateListened}</h1>
                </div>
            </div>
            <div className="flex -ml-4 items-center text-center mr-4 relative">
                    <div className="absolute">
                        {
                            showSidePanel ? (
                                <i className="fa-solid fa-caret-left text-4xl cursor-pointer text-blue-800 transition-opacity duration-300 ease-in-out hover:text-blue-600" onClick={() => setShowSidePanel(!showSidePanel)}></i>
                            ) : (
                                <i className="fa-solid fa-caret-right text-4xl cursor-pointer text-blue-800 transition-opacity duration-300 ease-in-out hover:text-blue-600" onClick={() => setShowSidePanel(!showSidePanel)}></i>
                            )
                        }
                    </div>
                </div>
            <div
                className={`flex flex-row gap-2 p-4 transition-all duration-300 ease-in-out overflow-hidden ${showSidePanel
                    ? "w-86 text-black overflow-y-scroll overflow-x-hidden rounded-r-4xl"
                    : "w-8 text-transparent rounded-r-4xl"
                    }`}
            >
                <div className="flex flex-col gap-4 w-full">
                    {
                        !disableControls &&
                        <div className={`${showSidePanel ? "opacity-100" : "opacity-0"} flex-col gap-2 transition-opacity duration-300 ease-in-out flex flex-row `}>
                            <button
                                className="bg-sky-500 w-8 h-8 rounded-md text-black cursor-pointer text-white"
                                onClick={() => setShowDeletePopup(true)}
                            >
                                <i className="fa-solid fa-brush"></i>
                            </button>
                            <button
                                className="bg-red-500 w-8 h-8 rounded-md text-black cursor-pointer text-white"
                                onClick={() => setShowDeletePopup(true)}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    }
                    {/* review */}
                    <div
                        className={`${showSidePanel ? "opacity-100" : "opacity-0"
                            } flex-col gap-2 transition-opacity duration-300 ease-in-out`}
                    >
                        <div className="p-2 bg-gray-100 w-72 rounded-lg border-2 border-gray-300 flex flex-row">
                            {
                                editReview ? (
                                    <div className="flex flex-row items-center w-full gap-2">
                                        <textarea defaultValue={item.albumInfo.review} className="bg-white w-9/10 rounded-md text-black p-1" onChange={(e) => setNewReview(e.target.value)} />
                                        <button
                                            className="bg-amber-500 w-8 h-8 rounded-md text-black cursor-pointer text-white"
                                            onClick={changeReview}
                                        >
                                            <i className="fa-solid fa-pencil"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-row w-full">
                                        <h1 className="w-9/10 italic break-words">{item.albumInfo.review}</h1>
                                        {
                                            !disableControls &&
                                            <i className="fa-solid fa-pencil cursor-pointer w-1/10 flex text-center mt-1" onClick={() => setEditReview(true)}></i>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div
                        className={`${showSidePanel ? "opacity-100" : "opacity-0"
                            } flex flex-col gap-2 transition-opacity duration-300 ease-in-out`}
                    >
                        {/* tracklist */}
                        {item.albumInfo.tracks.map((track, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className="flex flex-row gap-2 p-2 rounded-xl items-center hover:bg-blue-200 border-blue-800 border-2 transition-all duration-300 ease-in-out w-72 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!disableControls) {
                                            setEditTrackRating([1, idx])
                                        }
                                    }}
                                    title="Click to edit rating"
                                >
                                    <h1 className="text-black truncate w-7/8 text-lg overflow-hidden text-ellipsis">
                                        {track.title}
                                    </h1>
                                    {
                                        editTrackRating[0] === 1 && editTrackRating[1] === idx ? (
                                            <div className="flex flex-row gap-2 items-center text-center justify-center h-10">
                                                <input
                                                    min={1}
                                                    max={10}
                                                    placeholder="1-10"
                                                    className="w-16 bg-white text-blue-800 font-semibold text-xl border-2 border-blue-800 rounded-md text-center"
                                                    type="number"
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        setNewTrackRating(
                                                            Number(e.target.value)
                                                        )
                                                    }}
                                                />
                                                <button
                                                    className="bg-blue-800 hover:bg-blue-600 transition 150 ease-in-out text-white w-8 h-8 rounded-md text-black cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        changeTrackRating()
                                                    }}
                                                >
                                                    <i className="fa-solid fa-pencil"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-row gap-8 items-center text-center justify-center h-10 w-1/8">
                                                <h1 className="text-blue-800 font-bold text-2xl w-1/2">
                                                    {item.albumInfo.tracks[idx].trackRating !== 0 ? item.albumInfo.tracks[idx].trackRating : "-"}
                                                </h1>
                                                {/* <button
                                                    className="bg-white w-8 h-8 rounded-sm p-1 text-black cursor-pointer w-1/2 mr-4"
                                                    onClick={() => setEditTrackRating([1, idx])}
                                                >
                                                    <i className="fa-solid fa-pencil"></i>
                                                </button> */}
                                            </div>
                                        )
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {showDeletePopup && (
                <div className="absolute top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center">
                    <div className="flex flex-col gap-4 bg-black p-8 border-2 border-white rounded w-1/6 text-center rounded">
                        <h1>
                            Delete{" "}
                            <span className="italic">{item.albumInfo.title}</span>?
                        </h1>
                        <div className="flex flex-row gap-4 m-auto">
                            <button
                                className="bg-red-500 px-4 py-1 text-xl rounded w-16 cursor-pointer"
                                onClick={removeCatalogEntry}
                            >
                                Yes
                            </button>
                            <button
                                className="bg-white px-4 py-1 text-black text-xl rounded w-16 cursor-pointer"
                                onClick={() => setShowDeletePopup(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
