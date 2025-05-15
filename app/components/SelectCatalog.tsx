import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Catalog } from "../types/types";
import { createCatalog, fetchUserCatalogs } from "../app";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "../context/AuthContext";


export default function SelectCatalog({ user }: { user: User | null }) {
    const [createNewCatalog, setCreateNewCatalog] = useState<boolean>(false);
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);

    const [catalogName, setCatalogName] = useState<string>('');
    const [catalogDescription, setCatalogDescription] = useState<string>('');

    const { setCurrentCatalog } = useAuth();

    const clearInputFields = () => {    
        setCreateNewCatalog(false);
        setCatalogName('');
        setCatalogDescription('');
    }

    const submitCatalog = async () => {
        const catalogId = uuidv4();
        const newCatalog = {
            id: catalogId,
            userId: user?.uid || '',
            name: catalogName,
            description: catalogDescription,
            items: [],
        };

        await createCatalog(catalogName, catalogDescription, catalogId, user?.uid);

        // Update the catalogs state to include the new catalog
        setCatalogs((prevCatalogs) => [...prevCatalogs, newCatalog]);
        clearInputFields();
    };

    useEffect(() => {
        if (user) {
            const fetchCatalogs = async () => {
                const data = await fetchUserCatalogs(user.uid);
                const mappedData = (data || []).map(doc => ({
                    id: doc.id,
                    userId: doc.userId,
                    name: doc.name,
                    description: doc.description,
                    items: doc.items,
                }));
                setCatalogs(mappedData);
            }
            fetchCatalogs();
        }
    }, [user]);

    return (
        <div className="flex flex-row gap-4 justify-center h-8 text-center">
            <select
                disabled={catalogs.length === 0}
                className="flex bg-white text-black rounded-md text-md px-4 disabled:opacity-50 disabled:cursor-not-allowed text-black"
                title={catalogs.length === 0 ? "Add a catalog to enable selection" : ""}
                onChange={(e) => {
                    const selectedCatalog = catalogs.find(catalog => catalog.name === e.target.value);
                    if (selectedCatalog) {
                        setCurrentCatalog(selectedCatalog.id);
                        console.log(selectedCatalog.id);
                    }
                }}
            >
                <option key={0} value="" disabled className="text-black">Select a Catalog</option>
                {
                    catalogs.map((catalog, index) => {
                        return (
                            <option key={index} className="text-black">{catalog.name}</option>
                        )
                    })
                }
            </select>
            <button className="cursor-pointer flex bg-white text-black p-4 shadow-xl text-center items-center font-bold rounded w-8 justify-center" onClick={() => setCreateNewCatalog(true)}>+</button>
            {
                createNewCatalog &&
                <div className="w-screen h-screen bg-black/50 absolute top-0 left-0 flex justify-center items-center">
                    <div className="bg-black p-8 flex flex-col gap-4 border-2 border-white rounded w-1/4">
                        <button className="flex flex-end" onClick={clearInputFields}><i className="fa-solid fa-xmark hover:text-red-500 cursor-pointer"></i></button>
                        <div className="flex flex-col gap-8">
                            <input className="border-1 border-white p-2 rounded" type="text" placeholder="Catalog Name" onChange={(e) => setCatalogName(e.target.value)}></input>
                            <input className="border-1 border-white p-2 rounded" type="text" placeholder="Catalog Description" onChange={(e) => setCatalogDescription(e.target.value)}></input>
                            <button className="bg-white text-black w-3/4 disabled rounded m-auto cursor-pointer disabled:opacity-50" onClick={submitCatalog} disabled={!catalogName || !catalogDescription}>Create Catalog</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}