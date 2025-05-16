/* eslint-disable @next/next/no-img-element */
import { User } from "firebase/auth";
import SelectCatalog from "./SelectCatalog";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { CatalogItem } from "../types/types";
import { fetchCatalogItems } from "../app";
import CatalogItemEntry from "./catalog/CatalogItemEntry";
import CatalogOptions from "./catalog/CatalogOptions";
import YearlyCatalog from "./catalog/YearlyCatalog";

export default function Catalog({ user }: { user: User | null }) {
    const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filter, setFilter] = useState<string>("Last Added");
    const [filteredCatalogItems, setFilteredCatalogItems] = useState<CatalogItem[]>([]);
    const [filterView, setFilterView] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<string>("Standard");
    const { currentCatalog } = useAuth();

    useEffect(() => {
        if (user && currentCatalog) {
            const fetchCatalog = async () => {
                const data = await fetchCatalogItems(currentCatalog);
                setCatalogItems(data);
            };
            fetchCatalog();
        }
    }, [currentCatalog, user, catalogItems]);

    const sortCatalogItems = (items: CatalogItem[], filter: string) => {
        switch (filter) {
            case "Last Added":
                return items.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
            case "Date":
                return items.sort(
                    (a, b) => new Date(a.albumInfo.dateListened).getTime() - new Date(b.albumInfo.dateListened).getTime()
                );
            case "A-Z":
                return items.sort((a, b) => a.albumInfo.title.localeCompare(b.albumInfo.title));
            case "Z-A":
                return items.sort((a, b) => b.albumInfo.title.localeCompare(a.albumInfo.title));
            case "Highest Rating":
                return items.sort((a, b) => b.albumInfo.rating - a.albumInfo.rating);
            case "Lowest Rating":
                return items.sort((a, b) => a.albumInfo.rating - b.albumInfo.rating);
        }
        return items;
    };

    return (
        <div
            className={`flex flex-col h-[calc(100vh-100px)] gap-4 p-4 border-4 border-gray-200 bg-gray-100 overflow-y-hidden rounded-xl`}
        >
            <SelectCatalog user={user} />
            <div className="flex flex-col gap-4 h-full p-4">
                <CatalogOptions
                    filterView={filterView}
                    setFilterView={setFilterView}
                    setFilter={setFilter}
                    sortCatalogItems={sortCatalogItems}
                    catalogItems={catalogItems}
                    setFilteredCatalogItems={setFilteredCatalogItems}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    currentCatalog={currentCatalog}
                    showViewButton={true}
                />
                <div
                    className={`flex flex-row flex-wrap gap-8 mb-8 ${
                        viewMode === "Standard" ? "overflow-y-auto" : "overflow-hidden"
                    }`}
                >
                    {viewMode === "Standard" ? (
                        !filterView
                            ? catalogItems.map((item, idx) => (
                                    <CatalogItemEntry key={idx} item={item} disableControls={false} />
                                ))
                            : filteredCatalogItems.map((item, idx) => (
                                    <CatalogItemEntry key={idx} item={item} disableControls={true} />
                                ))
                    ) : (
                        <YearlyCatalog catalog={catalogItems} />
                    )}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-300 to-transparent pointer-events-none"></div>
        </div>
    );
}