import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Catalog } from "../types/types";
import { createCatalog, fetchUserCatalogs } from "../app";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../context/AuthContext";

export default function SelectCatalog({ user }: { user: User | null }) {
    const [createNewCatalog, setCreateNewCatalog] = useState<boolean>(false);
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [catalogName, setCatalogName] = useState<string>("");
    const [catalogDescription, setCatalogDescription] = useState<string>("");

    const { setCurrentCatalog } = useAuth();

    const clearInputFields = () => {
        setCreateNewCatalog(false);
        setCatalogName("");
        setCatalogDescription("");
    };

    const submitCatalog = async () => {
        const catalogId = uuidv4();
        const newCatalog = {
            id: catalogId,
            userId: user?.uid || "",
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
                const mappedData = (data || []).map((doc) => ({
                    id: doc.id,
                    userId: doc.userId,
                    name: doc.name,
                    description: doc.description,
                    items: doc.items,
                }));
                setCatalogs(mappedData);
            };
            fetchCatalogs();
        }
    }, [user]);

    return (
        <div className="flex flex-row gap-4 justify-center h-8 text-center">
            <select
                disabled={catalogs.length === 0}
                className="flex bg-white text-black rounded-4xl text-black h-10 text-lg px-4 border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed truncate"
                title={catalogs.length === 0 ? "Add a catalog to enable selection" : ""}
                onChange={(e) => {
                    const selectedCatalog = catalogs.find(
                        (catalog) => catalog.name === e.target.value
                    );
                    if (selectedCatalog) {
                        setCurrentCatalog(selectedCatalog.id);
                        console.log(selectedCatalog.id);
                    }
                }}
            >
                <option
                    key={0}
                    value=""
                    disabled
                    className="text-black"
                >
                    Select a Catalog
                </option>
                {catalogs.map((catalog, index) => (
                    <option
                        key={index}
                        className="text-black"
                    >
                        {catalog.name}
                    </option>
                ))}
            </select>
            <button
                className="cursor-pointer flex bg-white text-black p-4 text-center items-center font-bold rounded w-10 h-10 justify-center border-2 border-gray-200 hover:text-blue-600 transition 150 ease-in-out text-2xl"
                onClick={() => setCreateNewCatalog(true)}
            >
                +
            </button>
            {createNewCatalog && (
                <div className="w-screen h-screen bg-black/50 absolute top-0 left-0 flex justify-center items-center z-10">
                    <div className="bg-white p-8 flex flex-col gap-4 border-4 border-gray-300 rounded w-1/4 rounded-4xl">
                        <button
                            className="px-2 py-1 flex bg-red-600 hover:bg-red-400 transition 150 ease-in-out w-1/6 rounded-2xl text-center text-white justify-center cursor-pointer"
                            onClick={clearInputFields}
                        >
                            Close
                        </button>
                        <div className="flex flex-col gap-4">
                            <input
                                className="border-3 border-gray-300 py-2 px-4 rounded-4xl"
                                type="text"
                                placeholder="Catalog Name"
                                onChange={(e) => setCatalogName(e.target.value)}
                            />
                            <input
                                className="border-3 border-gray-300 py-2 px-4 rounded-4xl"
                                type="text"
                                placeholder="Catalog Description"
                                onChange={(e) => setCatalogDescription(e.target.value)}
                            />
                            <button
                                className="bg-blue-800 hover:bg-blue-600 transition 150 ease-in-out text-white w-1/3 px-4 py-2 disabled rounded-4xl m-auto cursor-pointer disabled:opacity-50"
                                onClick={submitCatalog}
                                disabled={!catalogName || !catalogDescription}
                            >
                                Create Catalog
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}