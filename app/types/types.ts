export type Catalog = {
    id: string;
    userId: string;
    name: string;
    description: string;
    items: CatalogItem[];
}

export type CatalogItem = {
    id: string;
    albumInfo: Album;
    dateAdded: string;
    catalogId: string;
}

export type Album = {
    id: string;
    title: string;
    artist: string;
    cover: string;
    rating: number;
    review: string;
    dateListened: string;
    tracks: Track[]; 
};

export type Track = {
    albumId: string; 
    title: string;
    duration: string; 
    trackRating: number
}

export type UserAccount = {
    id: string;
    email: string;
    catalogs: Catalog[];
}