import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import Station from "../types/Station";
import {Filtered} from "../types/Filtered";
import useLocationRegion from "../hook/useLocationRegion";
import parseStationPrices from "../utils/parseStationPrices";
import calculateDistance from "../utils/calculateDistance";

interface DataContextType {
    data: Station[];
    setData: React.Dispatch<React.SetStateAction<Station[]>>;
    filteredData: any;
    setFilteredData: React.Dispatch<React.SetStateAction<any>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [baseData, setBaseData] = useState<Station[]>([]);
    const [data, setData] = useState<Station[]>([]);
    const region = useLocationRegion();
    const [filteredData, setFilteredData] = useState<Filtered>({
        fuelType: ["E10"],
        is_best: true,
    });
    useEffect(() => {
        const encodedUri = encodeURI(`https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?` + "select=*&where=cp=13100");
        fetch(encodedUri)
            .then((r) => {
                if (!r.ok) throw new Error(r.statusText);
                return r.json();
            })
            .then((data: any) => setBaseData(data.results))
    }, []);

    useEffect(() => {
        console.log(filteredData);

        if (!filteredData.is_best) {
            setData(baseData);
            return;
        }

        let lowestPrice = Infinity;
        let stationsWithLowestPrice: Station[] = [];

        for (const station of baseData) {
            const prix = parseStationPrices(station);
            for (const fuel of prix) {
                if (fuel.nom === "E10" && fuel.valeur as unknown as number < lowestPrice) { //ici j'ai pas compris l'erreur, bzr mais pas important
                    lowestPrice = fuel.valeur as unknown as number;
                    stationsWithLowestPrice = [station];
                } else if (fuel.nom === "E10" && fuel.valeur as unknown as number === lowestPrice) {
                    stationsWithLowestPrice.push(station);
                }
            }
        }

        if (stationsWithLowestPrice.length > 1) { //ici erreur car dans le hook de region mettre une valeur par default ca marche pas tres bien je laisse les erreurs mais en soit il y aura jamais de region vide
            stationsWithLowestPrice.sort((a, b) =>
                calculateDistance(region.latitude, region.longitude, a.geom.lat, a.geom.lon) -
                calculateDistance(region.latitude, region.longitude, b.geom.lat, b.geom.lon)
            );
        }

        setData(baseData);





    }, [filteredData, baseData]);


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
