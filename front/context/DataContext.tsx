import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import Station from "../types/Station";
import { Filtered } from "../types/Filtered";
import useLocationRegion from "../hook/useLocationRegion";
import parseStationPrices from "../utils/parseStationPrices";
import calculateDistance from "../utils/calculateDistance";
import getFuelInfo from "../utils/getFuelInfo";
import { FuelInfo } from "../types/FuelInfo";

interface DataContextType {
    data: Station[];
    fuelInfo: Record<string, FuelInfo>;
    setData: React.Dispatch<React.SetStateAction<Station[]>>;
    filteredData: Filtered;
    setFilteredData: React.Dispatch<React.SetStateAction<Filtered>>;
    baseData: Station[];
    setBaseData: React.Dispatch<React.SetStateAction<Station[]>>;
    isDragging: boolean;
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { region } = useLocationRegion();
    const [baseData, setBaseData] = useState<Station[]>([]); // sert pour avoir les données vierge peut etre utile au cas ou
    const [data, setData] = useState<Station[]>([]);
    const [fuelInfo, setFuelInfo] = useState<any>({});
    const [isDragging, setIsDragging] = useState(true);
    const [filteredData, setFilteredData] = useState<Filtered>({
        fuelType: "SP98",
        is_best: true,
    });

    useEffect(() => {
        if (!baseData) return;

        const fuelType = filteredData.fuelType;
        const fuel = fuelInfo[fuelType];
        if (!fuel) return;

        const { minStations = [] } = fuel;

        let bestStationId: number | null = null;

        if (minStations.length > 1 && region) {
            const { latitude = 0, longitude = 0 } = region;
            minStations.sort((a: { geom: { lat: number; lon: number; }; }, b: { geom: { lat: number; lon: number; }; }) =>
                calculateDistance(latitude, longitude, a.geom.lat, a.geom.lon) -
                calculateDistance(latitude, longitude, b.geom.lat, b.geom.lon)
            );
        }

        bestStationId = minStations[0]?.id ?? null;

        const updatedStations = baseData.map(station => {
            const isBest = station.id === bestStationId;
            const isVisible = filteredData.is_best
                ? isBest
                : parseStationPrices(station).some((price: any) => price.nom === fuelType);

            return {
                ...station,
                isBest,
                isVisible
            };
        });

        setData(updatedStations);
    }, [filteredData, fuelInfo]);

    useEffect(() => {
        setFuelInfo(getFuelInfo({ stations: baseData })); //module en plus pour les stats min max avg
    }, [baseData]);

    return ( //mon vier pour le isDragging
        <DataContext.Provider value={{ data, fuelInfo, setData, filteredData, setFilteredData, setBaseData, baseData, isDragging, setIsDragging }}>
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