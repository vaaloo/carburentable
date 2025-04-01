import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import Station from "../types/Station";
import {Filtered} from "../types/Filtered";
import useLocationRegion from "../hook/useLocationRegion";
import parseStationPrices from "../utils/parseStationPrices";
import calculateDistance from "../utils/calculateDistance";

// Interface étendue pour inclure les stations avec leur opacité
interface StationWithOpacity extends Station {
    opacity: number;
}

interface DataContextType {
    data: StationWithOpacity[];
    setData: React.Dispatch<React.SetStateAction<StationWithOpacity[]>>;
    filteredData: any;
    setFilteredData: React.Dispatch<React.SetStateAction<any>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [baseData, setBaseData] = useState<Station[]>([]);
    const [data, setData] = useState<StationWithOpacity[]>([]);
    const region = useLocationRegion();
    const [filteredData, setFilteredData] = useState<Filtered>({
        fuelType: "E10",
        is_best: true,
    });

    useEffect(() => {
        const encodedUri = encodeURI(`https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?` + "select=*&where=cp=13100");
        fetch(encodedUri)
            .then((response) => {
                console.log("Response status:", response.status);
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setBaseData(data.results);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    useEffect(() => {
        if (!baseData.length) return;

        if (!filteredData.is_best) {
            // Afficher toutes les stations avec une opacité complète
            const allStationsWithOpacity = baseData.map(station => ({
                ...station,
                opacity: 1
            }));
            setData(allStationsWithOpacity);
            return;
        }

        // Trouver le prix le plus bas pour le type de carburant sélectionné
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
                calculateDistance(region.latitude, region.longitude, a.geom.lat, a.geom.lon) -
                calculateDistance(region.latitude, region.longitude, b.geom.lat, b.geom.lon)
            );
        }

        const stationsWithOpacity: StationWithOpacity[] = baseData.map(station => {
            const isBestStation = stationsWithLowestPrice.length > 0 &&
                station.id === stationsWithLowestPrice[0].id;

            return {
                ...station,
                opacity: isBestStation ? 1 : 0.3
            };
        });

        setData(stationsWithOpacity);

    }, [filteredData, baseData, region]);

    return (
        <DataContext.Provider value={{ data, setData, filteredData, setFilteredData }}>
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