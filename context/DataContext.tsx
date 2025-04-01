import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Station from "../types/Station";
import {Filtered} from "../types/Filtered";
import useLocationRegion from "../hook/useLocationRegion";
import parseStationPrices from "../utils/parseStationPrices";
import calculateDistance from "../utils/calculateDistance";

interface StationWithVisibility extends Station {
    isVisible: boolean;
}

interface DataContextType {
    data: StationWithVisibility[];
    setData: React.Dispatch<React.SetStateAction<StationWithVisibility[]>>;
    filteredData: any;
    setFilteredData: React.Dispatch<React.SetStateAction<any>>;
    baseData: any;
    setBaseData: React.Dispatch<React.SetStateAction<any>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { region, zipCode } = useLocationRegion();
    const [baseData, setBaseData] = useState<Station[]>([]);
    const [data, setData] = useState<Station[]>([]);
    const [filteredData, setFilteredData] = useState<Filtered>({
        fuelType: "E10",
        is_best: true,
    });

    useEffect(() => {
        if (!baseData.length) return;

        if (!filteredData.is_best) {
            const allStationsWithVisibility = baseData.map(station => ({
                ...station,
                isVisible: true
            }));
            setData(allStationsWithVisibility);
            return;
        }

        let lowestPrice = Infinity;
        let stationsWithLowestPrice: Station[] = [];

        for (const station of baseData) {
            const prix = parseStationPrices(station);
            for (const fuel of prix) {
                if (fuel.nom === filteredData.fuelType && fuel.valeur as unknown as number < lowestPrice) {
                    lowestPrice = fuel.valeur as unknown as number;
                    stationsWithLowestPrice = [station];
                } else if (fuel.nom === filteredData.fuelType && fuel.valeur as unknown as number === lowestPrice) {
                    stationsWithLowestPrice.push(station);
                }
            }
        }

        if (stationsWithLowestPrice.length > 1 && region) {
            stationsWithLowestPrice.sort((a, b) =>
                calculateDistance(region?.latitude || 0, region?.longitude || 0, a.geom.lat, a.geom.lon) -
                calculateDistance(region?.latitude || 0, region?.longitude || 0, b.geom.lat, b.geom.lon)
            );
        }

        const stationsWithVisibility: StationWithVisibility[] = baseData.map(station => {
            const isBestStation = stationsWithLowestPrice.length > 0 &&
                station.id === stationsWithLowestPrice[0].id;

            return {
                ...station,
                isVisible: isBestStation
            };
        });

        setData(stationsWithVisibility);
    }, [filteredData, baseData, region]);

    return (
        <DataContext.Provider value={{ data, setData, filteredData, setFilteredData, setBaseData, baseData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};