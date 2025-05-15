"use client";

import { fetchCatalogItems } from "@/app/app";
import CatalogItemEntry from "@/app/components/catalog/CatalogItemEntry";
import CatalogOptions from "@/app/components/catalog/CatalogOptions";
import YearlyCatalog from "@/app/components/catalog/YearlyCatalog";
import { CatalogItem } from "@/app/types/types";
import { useEffect, useState } from "react";
import { use } from "react";

export default function View({ params }: { params: Promise<{ id: string }> }) {
    const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
    const [filterView, setFilterView] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filter, setFilter] = useState<string>('Last Added');
    const [filteredCatalogItems, setFilteredCatalogItems] = useState<CatalogItem[]>([]);
    const [viewMode, setViewMode] = useState<string>('Standard');

    const { id } = use(params);

    useEffect(() => {
        const fetchViewCatalog = async () => {
            const catalog = await fetchCatalogItems(id);
            if (catalog && Array.isArray(catalog)) {
                setCatalogItems(catalog.map(item => ({
                    ...item,
                    albumInfo: item.albumInfo || null,
                    dateAdded: item.dateAdded || new Date(),
                    catalogId: item.catalogId || ''
                })));
            } else {
                console.error("Catalog not found or invalid format");
            }
        };
        fetchViewCatalog();
    }, [id])

    const sortCatalogItems = (items: CatalogItem[], filter: string) => {
        switch (filter) {
            case 'Last Added':
                return items.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
            case 'Date':
                return items.sort((a, b) => new Date(a.albumInfo.dateListened).getTime() - new Date(b.albumInfo.dateListened).getTime());
            case 'A-Z':
                return items.sort((a, b) => a.albumInfo.title.localeCompare(b.albumInfo.title));
            case 'Z-A':
                return items.sort((a, b) => b.albumInfo.title.localeCompare(a.albumInfo.title));
            case 'Highest Rating':
                return items.sort((a, b) => b.albumInfo.rating - a.albumInfo.rating);
            case 'Lowest Rating':
                return items.sort((a, b) => a.albumInfo.rating - b.albumInfo.rating);
        }
        return items;
    }

    return (
        <div className={`flex flex-col h-[calc(100vh-100px)] gap-4 border-2 border-white p-4 mt-4 overflow-y-hidden`}>
            <div className="flex flex-col gap-4 h-full p-4">
                <div className="flex flex-row items-center gap-4 bg-gray-800 p-2 rounded justify-between px-4">
                    <CatalogOptions
                        filterView={filterView}
                        setFilterView={setFilterView}
                        setFilter={setFilter}
                        sortCatalogItems={sortCatalogItems}
                        catalogItems={catalogItems}
                        setFilteredCatalogItems={setFilteredCatalogItems}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        currentCatalog={id}
                        showViewButton={false}
                    />
                </div>
                <div className={`flex flex-row flex-wrap gap-8 ${viewMode === 'Standard' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                    {
                        viewMode === 'Standard' ?
                            (
                                !filterView ?
                                    catalogItems.map((item, idx) => {
                                        return (
                                            <CatalogItemEntry key={idx} item={item} disableControls={true} />
                                        )
                                    }) :
                                    filteredCatalogItems.map((item, idx) => {
                                        return (
                                            <CatalogItemEntry key={idx} item={item} disableControls={true} />
                                        )
                                    })
                            ) : (
                                <YearlyCatalog catalog={catalogItems} />
                            )
                    }
                </div>
            </div>
        </div>
    );

}