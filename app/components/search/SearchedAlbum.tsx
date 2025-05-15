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
            className="flex flex-col bg-gray-200 p-4 rounded-xl shadow-lg hover:scale-105 transition duration-100 cursor-pointer h-44 border-gray-300 border-2"
            onClick={() => onClick(title, artist)}
            title={`${title} by ${artist}`}
         >
            <img src={cover || '/noimage.png'} alt="Album Cover rounded" className="w-20" />
            <h1 className="text-lg font-semibold truncate">{title}</h1>
            <h2 className="italic">{artist}</h2>
         </div>
    )
}