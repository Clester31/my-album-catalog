/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react";
import { getAlbumInfo, searchForAlbum } from "../app";
import { Album } from "../types/types";
import SearchedAlbum from "./search/SearchedAlbum";
import AlbumInfo from "./search/AlbumInfo";
import { User } from "firebase/auth";

export default function AlbumSearch({ user }: { user: User | null }) {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Album[]>([]);

    const [displayAlbumInfo, setDisplayAlbumInfo] = useState<boolean>(false);
    const [albumInfo, setAlbumInfo] = useState<Album | null>(null);

    const updateSearchResults = async (searchQuery: string) => {
        const response = await searchForAlbum(searchQuery);
        if (response) {
            setSearchResults(response);
        }
        else {
            setSearchResults([]);
        }
        setSearchQuery('');
    }

    const displayAlbumDetails = async (title: string, artist: string) => {
        const allAlbumInfo = await getAlbumInfo(artist, title);
        setAlbumInfo({
            id: allAlbumInfo.mbid,
            title: allAlbumInfo.name,
            artist: allAlbumInfo.artist,
            cover: allAlbumInfo.image[3]['#text'],
            rating: 0,
            tracks: allAlbumInfo.tracks?.track
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? allAlbumInfo.tracks.track.map((track: any) => {
                    return {
                        id: track.mbid,
                        albumId: allAlbumInfo.mbid,
                        title: track.name,
                        duration: track.duration,
                        rating: 0
                    };
                })
                : [],
        } as Album);
        setDisplayAlbumInfo(true);
    }

    return (
        <div className="search_bar bg-gray-100 shadow-lg rounded-xl h-full p-4 relative border-4 border-gray-200">
            <div className="h-max">
                {
                    displayAlbumInfo ?
                        (
                            <AlbumInfo album={albumInfo} hideDisplay={setDisplayAlbumInfo} user={user} />
                        )
                        :
                        <div>
                            <div className="gap-4 flex flex-col items-center">
                                <h1 className="text-lg font-semibold">Search for an Artist</h1>
                                <div className="flex flex-row gap-4 w-full items-center">
                                    <input
                                        className="w-5/6 border-blue-800 rounded-4xl border-2 bg-white text-black text-xl py-2 px-4 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                updateSearchResults(searchQuery);
                                            }
                                        }}
                                        disabled={!user}
                                    />
                                    <button
                                        className="bg-blue-800 text-white px-4 rounded-4xl ml-2 cursor-pointer h-10 w-1/6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-150 ease-in-out"
                                        onClick={() => updateSearchResults(searchQuery)}
                                        disabled={!searchQuery || !user}
                                    >
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </div>
                            </div>
                            {
                                user ?
                                    <div className="album_list mt-8 flex grid grid-cols-3 gap-4 h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden relative p-2">
                                        {searchResults.map((album, index) => (
                                            <SearchedAlbum key={index} title={album.title} artist={album.artist} cover={album.cover} onClick={() => displayAlbumDetails(album.title, album.artist)} />
                                        ))}
                                    </div>
                                    :
                                    <div className="mt-8 flex h-[calc(100vh-250px)] overflow-y-auto overflow-x-hidden items-center justify-center text-center m-auto">
                                        <h1 className="text-lg w-max">Sign in to search for albums and create catalogs</h1>
                                    </div>
                            }

                        </div>

                }
            </div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-300 to-transparent pointer-events-none"></div>
        </div>
    )
}