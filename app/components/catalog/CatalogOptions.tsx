import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { CatalogItem } from "@/app/types/types";

interface CatalogOptionsProps {
    filterView: boolean;
    setFilterView: Dispatch<SetStateAction<boolean>>;
    setFilter: Dispatch<SetStateAction<string>>;
    sortCatalogItems: (items: CatalogItem[], filter: string) => CatalogItem[];
    catalogItems: CatalogItem[];
    setFilteredCatalogItems: Dispatch<SetStateAction<CatalogItem[]>>;
    viewMode: string;
    setViewMode: Dispatch<SetStateAction<string>>;
    currentCatalog: string | null;
    showViewButton: boolean;
}

export default function CatalogOptions({
    filterView,
    setFilterView,
    setFilter,
    sortCatalogItems,
    catalogItems,
    setFilteredCatalogItems,
    viewMode,
    setViewMode,
    currentCatalog,
    showViewButton,
}: CatalogOptionsProps) {
    const router = useRouter();

    return (
        <div className="flex flex-row items-center gap-4 bg-white border-2 border-gray-300 rounded-4xl p-2 rounded justify-between px-4">
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-4 items-center">
                    <button disabled={viewMode === 'Yearly'} className="disabled:opacity-50" onClick={() => {
                                setFilterView(!filterView);
                                setFilter("");
                            }}>
                        <i
                            className={`fa-solid fa-filter text-lg cursor-pointer ${filterView && "text-blue-800"}`}
                        ></i>
                    </button>
                    <select
                        className="bg-gray-100 px-4 rounded-4xl border-2 border-gray-300 text-black p-1 rounded disabled:opacity-50 text-sm"
                        disabled={!filterView}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            const sortedItems = sortCatalogItems(catalogItems, e.target.value);
                            setFilteredCatalogItems(sortedItems);
                        }}
                    >
                        <option value="" disabled selected>
                            Select a filter
                        </option>
                        <option value="Last Added">Last Added</option>
                        <option value="Date">Date</option>
                        <option value="A-Z">A-Z</option>
                        <option value="Z-A">Z-A</option>
                        <option value="Highest Rating">Highest Rating</option>
                        <option value="Lowest Rating">Lowest Rating</option>
                    </select>
                </div>
                <div className="flex flex-row items-center text-white text-sm">
                    <button
                        className={`${viewMode === "Standard" ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-500 transition 150 ease-in-out"
                            } rounded-l-4xl py-1 px-2 w-32 cursor-pointer`}
                        onClick={() => setViewMode("Standard")}
                    >
                        Standard View
                    </button>
                    <button
                        className={`${viewMode === "Yearly" ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-500 transition 150 ease-in-out"    
                            } rounded-r-4xl py-1 px-2 w-32 cursor-pointer`}
                        onClick={() => setViewMode("Yearly")}
                    >
                        Yearly View
                    </button>
                </div>
            </div>
            <div className="text-sm ">
                {
                    showViewButton ? (
                        <button
                            className="bg-blue-800 hover:bg-blue-600 transition 150 ease-in-out text-white py-1 px-4 rounded-4xl cursor-pointer"
                            onClick={() => router.push(`/view/${currentCatalog}`)}
                        >
                            View Catalog
                        </button>
                    ) : (
                        <button
                            className="bg-blue-800 hover:bg-blue-600 transition 150 ease-in-out text-white py-1 px-4 rounded-4xl cursor-pointer"
                            onClick={() => router.push(`/`)}
                        >
                            Return Home
                        </button>
                    )
                }
            </div>
        </div>
    );
}