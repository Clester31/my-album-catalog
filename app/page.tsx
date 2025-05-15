"use client";

import { useEffect, useState } from "react";
import AlbumSearch from "./components/AlbumSearch";
import { useAuth } from "./context/AuthContext";
import { User } from "firebase/auth";
import Catalog from "./components/Catalog";
import { fetchUserCatalogs } from "./app";

export default function Home() {
  const { user, setCurrentCatalog } = useAuth();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [hideAlbumSearch, setHideAlbumSearch] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setLoggedInUser(user);
      const fetchCatalogs = async () => {
        const data = await fetchUserCatalogs(user.uid);
        const mappedData = (data || []).map(doc => ({
          id: doc.id,
          userId: doc.userId,
          name: doc.name,
          description: doc.description,
          items: doc.items,
        }));
        setCurrentCatalog(mappedData[0]?.id || null);
      }
      fetchCatalogs();
    }
  }, [user, setCurrentCatalog]);

  return (
    <div className="mx-4">
      <div className="flex flex-row mt-4 gap-4">
        <div className=" h-[calc(100vh-100px)] flex items-center justify-center">
          {
            hideAlbumSearch ?
              <button>
                <i className="fa-solid fa-caret-right cursor-pointer text-4xl text-start hover:scale-110 hover:text-orange-500 transition-250 ease-in" onClick={() => setHideAlbumSearch(false)}></i>
              </button>
              :
              <button>
                <i className="fa-solid fa-caret-left cursor-pointer text-4xl text-start hover:scale-110 hover:text-orange-500 transition-250 ease-in" onClick={() => setHideAlbumSearch(true)}></i>
              </button>
          }
        </div>
        <div
          className={`${hideAlbumSearch ? 'w-0 opacity-0' : 'w-3/10'} transition-all duration-300 ease-in-out`}
        >
          <AlbumSearch user={loggedInUser} />
        </div>
        <div
          className={`${hideAlbumSearch ? 'w-full overflow-x-hidden' : 'w-7/10 overflow-x-hidden'} transition-all duration-300 ease-in-out`}
        >
          <Catalog user={loggedInUser} />
        </div>
      </div>
    </div>
  )
}