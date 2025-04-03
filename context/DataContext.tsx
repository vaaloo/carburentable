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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { region } = useLocationRegion();
    const [baseData, setBaseData] = useState<Station[]>([]); // sert pour avoir les données vierge peut etre utile au cas ou
    const [data, setData] = useState<Station[]>([]);
    const [fuelInfo, setFuelInfo] = useState<any>({});
    const [filteredData, setFilteredData] = useState<Filtered>({
        fuelType: "SP98",
        is_best: true,
    });


    useEffect(() => { // sert pour l'ouverture fermeture du footer
        if (!baseData.length) return;

        if (!filteredData.is_best) { // savoir si le footer est haut ou bas
            setData(data.map(station => ({ // toute les stations sont visible
                ...station,
                isVisible: true
            })));

        } else {
            setData(data.map(station => ({
                ...station,
                isVisible: station.isBest  // Seules les stations `isBest` restent visibles
            })));
        }


    }, [filteredData]);

    useEffect(() => {
        setFuelInfo(getFuelInfo({ stations: baseData })); //module en plus pour les stats min max avg
    }, [baseData]);

    useEffect(() => {
        if (!fuelInfo[filteredData.fuelType]) return;
        let stationsWithLowestPrice: Station[] = fuelInfo[filteredData.fuelType]?.minStations || [];

        if (stationsWithLowestPrice.length > 1 && region) {
            stationsWithLowestPrice.sort((a, b) =>
                calculateDistance(region?.latitude || 0, region?.longitude || 0, a.geom.lat, a.geom.lon) -
                calculateDistance(region?.latitude || 0, region?.longitude || 0, b.geom.lat, b.geom.lon)
            );
        }

        const stationsWithVisibility: Station[] = baseData.map(station => {
            const isBestStation = stationsWithLowestPrice.length > 0 &&
                station.id === stationsWithLowestPrice[0].id;

            return {
                ...station,
                isBest: isBestStation,
                isVisible: isBestStation
            };
        });

        setData(stationsWithVisibility);

    }, [fuelInfo]);



    return (
        <DataContext.Provider value={{ data, fuelInfo, setData, filteredData, setFilteredData, setBaseData, baseData }}>
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
