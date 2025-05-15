import { Album, CatalogItem } from "./types/types";
import { updateDoc, getDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

export const searchForAlbum = async (query: string) => {
    const albumData: Album[] = [];
    const res = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${query}&api_key=${process.env.NEXT_PUBLIC_API_KEY}&format=json`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    const data = await res.json();
    for (const album of data.topalbums.album) {
        const albumInfo: Album = {
            id: album.mbid,
            title: album.name,
            artist: album.artist.name,
            cover: album.image[3]['#text'],
            rating: 0,
            review: '',
            dateListened: '',
            tracks: [],
        }
        albumData.push(albumInfo);
    }

    return albumData;
}

export const getAlbumInfo = async (artist: string, album: string) => {
    const res = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${process.env.NEXT_PUBLIC_API_KEY}&artist=${artist}&album=${album}&format=json`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    const data = await res.json();
    return data.album;
}

export const createCatalog = async (catalogName: string, description: string, catalogId: string, userId: string | undefined) => {
    try {
        if (!userId) {
            throw new Error("No userID");
        }
        await setDoc(doc(db, "catalogs", catalogId), {
            id: catalogId,
            userId: userId,
            name: catalogName,
            description: description,
            items: [],
        });

        await updateDoc(doc(db, "users", userId), {
            catalogs: arrayUnion(catalogId),
        });

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const addAlbumToCatalog = async (catalogItem: CatalogItem) => {
    console.log(catalogItem.catalogId)
    try {
        await updateDoc(doc(db, "catalogs", catalogItem.catalogId), {
            items: arrayUnion(catalogItem),
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const fetchUserCatalogs = async (userId: string) => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            const catalogIds = userDoc.data().catalogs || [];
            const catalogs = [];
            for (const catalogId of catalogIds) {
                const catalogDoc = await getDoc(doc(db, "catalogs", catalogId));
                if (catalogDoc.exists()) {
                    catalogs.push(catalogDoc.data());
                }
            }
            return catalogs;
        } else {
            throw new Error("User not found");
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const fetchCatalogItems = async (catalogId: string | null) => {
    try {
        if (!catalogId) {
            throw new Error("no catalogId");
        }

        const catalogDoc = await getDoc(doc(db, "catalogs", catalogId));
        if (catalogDoc.exists()) {
            return catalogDoc.data().items || [];
        } else {
            throw new Error("Catalog not found");
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const updateAlbumRating = async (catalogId: string, albumId: string, newRating: number) => {
    try {
        const catalogDoc = await getDoc(doc(db, "catalogs", catalogId));
        if (catalogDoc.exists()) {
            const catalogItems = catalogDoc.data().items || [];
            const updatedItems = catalogItems.map((item: CatalogItem) => {
                if (item.albumInfo.id === albumId) {
                    return {
                        ...item,
                        albumInfo: {
                            ...item.albumInfo,
                            rating: newRating,
                        },
                    };
                }
                return item;
            });
            await updateDoc(doc(db, "catalogs", catalogId), {
                items: updatedItems,
            });
        }
    } catch (error) {
        console.error("Error updating album rating: ", error);
    }
}

export const updateTrackRating = async (catalogId: string, albumId: string, trackIndex: number, newRating: number) => {
    try {
        const catalogDoc = await getDoc(doc(db, "catalogs", catalogId));
        if (catalogDoc.exists()) {
            const catalogItems = catalogDoc.data().items || [];
            const updatedItems = catalogItems.map((item: CatalogItem) => {
                if (item.albumInfo.id === albumId) {
                    const updatedTracks = item.albumInfo.tracks.map((track, index) => {
                        if (index === trackIndex) {
                            return {
                                ...track,
                                trackRating: newRating,
                            };
                        }
                        return track;
                    });
                    return {
                        ...item,
                        albumInfo: {
                            ...item.albumInfo,
                            tracks: updatedTracks,
                        },
                    };
                }
                return item; 
            });
            await updateDoc(doc(db, "catalogs", catalogId), {
                items: updatedItems,
            });
        }
    } catch (error) {
        console.error("Error updating track rating: ", error);
    }
}

export const updateReview = async (catalogId: string, albumId: string, newReview: string) => {
try {
        const catalogDoc = await getDoc(doc(db, "catalogs", catalogId));
        if (catalogDoc.exists()) {
            const catalogItems = catalogDoc.data().items || [];
            const updatedItems = catalogItems.map((item: CatalogItem) => {
                if (item.albumInfo.id === albumId) {
                    return {
                        ...item,
                        albumInfo: {
                            ...item.albumInfo,
                            review: newReview,
                        },
                    };
                }
                return item;
            });
            await updateDoc(doc(db, "catalogs", catalogId), {
                items: updatedItems,
            });
        }
    } catch (error) {
        console.error("Error updating album rating: ", error);
    }
}

export const deleteCatalogEntry = async (catalogId: string, albumId: string) => {
    try {
        const catalogDoc = await getDoc(doc(db, "catalogs", catalogId));
        if (catalogDoc.exists()) {
            const updatedItems = catalogDoc.data().items.filter((item: CatalogItem) => item.albumInfo.id !== albumId);
            await updateDoc(doc(db, "catalogs", catalogId), {
                items: updatedItems,
            });
        }
    } catch (error) {
        console.error("Error deleting catalog entry: ", error);
    }
}