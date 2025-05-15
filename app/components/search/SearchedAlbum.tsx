/* eslint-disable @next/next/no-img-element */
interface SearchedAlbumProps {
    title: string;
    artist: string;
    cover: string;
    onClick: (title: string, artist: string) => void;
}

export default function SearchedAlbum({ title, artist, cover, onClick }: SearchedAlbumProps) {
    return (
         <div 
            className="flex flex-col bg-gray-800 p-2 rounded shadow-md hover:scale-105 transition duration-100 cursor-pointer"
            onClick={() => onClick(title, artist)}
         >
            <img src={cover || '/noimage.png'} alt="Album Cover rounded" className="w-20" />
            <h1 className="text-lg font-semibold">{title}</h1>
            <h2 className="text-gray-200">{artist}</h2>
         </div>
    )
}