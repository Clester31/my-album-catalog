/* eslint-disable @next/next/no-img-element */
import { CatalogItem } from "@/app/types/types";
import { useState, useEffect } from "react";
import CatalogItemEntry from "./CatalogItemEntry";

export default function YearlyCatalog({ catalog }: { catalog: CatalogItem[] }) {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [currentYearItems, setCurrentYearItems] = useState<CatalogItem[]>([]);
    const [currentYearItemsByMonth, setCurrentYearItemsByMonth] = useState<CatalogItem[][]>(Array.from({ length: 12 }, () => []));

    const [borderColors, setBorderColors] = useState<string[]>(
        [
            "border-red-400",
            "border-orange-400",
            "border-yellow-400",
            "border-lime-400",
            "border-green-400",
            "border-teal-400",
            "border-sky-400",
            "border-blue-400",
            "border-indigo-400",
            "border-purple-400",
            "border-pink-400",
            "border-rose-400",
        ]
    );

    const updateYearData = (newYear: number) => {
        const filteredItems = catalog.filter(item => {
            const date = new Date(item.albumInfo.dateListened);
            return date.getFullYear() === newYear;
        });
        setCurrentYearItems(filteredItems);
        const itemsByMonth: CatalogItem[][] = Array.from({ length: 12 }, () => []);
        filteredItems.forEach(item => {
            const date = new Date(item.albumInfo.dateListened);
            itemsByMonth[date.getMonth()].push(item);
        });
        itemsByMonth.forEach(monthItems => {
            monthItems.sort((a, b) => {
                const dateA = new Date(a.albumInfo.dateListened);
                const dateB = new Date(b.albumInfo.dateListened);
                return dateA.getDate() - dateB.getDate();
            });
        });
        setCurrentYearItemsByMonth(itemsByMonth);
    };

    const changeYear = (amt: number) => {
        const newYear = year + amt;
        setYear(newYear);
        updateYearData(newYear);
    };

    useEffect(() => {
        updateYearData(year);
    }, [catalog, year]);

    return (
        <div className="flex flex-col gap-4 h-full p-4 w-full overflow-y-hidden">
            <div className="flex flex-row gap-4 items-center text-center justify-center">
                <button onClick={() => changeYear(-1)}>
                    <i className="fa-solid fa-caret-left cursor-pointer text-2xl text-start hover:scale-110 hover:text-orange-500 transition-250 ease-in"></i>
                </button>
                <h1 className="text-2xl">{year}</h1>
                <button onClick={() => changeYear(1)}>
                    <i className="fa-solid fa-caret-right cursor-pointer text-2xl text-start hover:scale-110 hover:text-orange-500 transition-250 ease-in"></i>
                </button>
            </div>
            <div className="flex flex-col h-full p-4 overflow-y-auto">
                {
                    currentYearItems.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {
                                currentYearItemsByMonth.map((monthItems, idx) => (
                                    <div key={idx} className={`flex flex-col items-start border-4 ${borderColors[idx]} p-4 rounded-lg overflow-x-auto`}>
                                        <h2 className="text-xl">{new Date(0, idx).toLocaleString('default', { month: 'long' })}</h2>
                                        <div className="flex flex-row gap-2">
                                            {
                                                monthItems.length > 0 ? (
                                                    monthItems.map((item, idx) => (
                                                        <div key={idx} className="flex flex-row items-center gap-4">
                                                            <CatalogItemEntry key={idx} item={item} disableControls={true} />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500">No albums for this month.</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p>No albums found for this year.</p>
                    )
                }
            </div>
        </div>
    );
}