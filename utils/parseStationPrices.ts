import { Prix } from "../types/Prix";
import Station from "../types/Station";

const parseStationPrices = (station: Station): Prix[] => {
    if (!station.prix) return [];

    let prices: any[];

    try {
        prices = JSON.parse(station.prix);
    } catch (e) {
        console.error("Failed to parse prices:", e);
        return [];
    }

    if (!Array.isArray(prices)) {
        prices = [prices];
    }

    return prices.map(item =>
        Object.keys(item).reduce((acc, key) => {
            // @ts-ignore
            acc[key.replace("@", "")] = item[key];
            return acc;
        }, {} as Prix)
    );
};

export default parseStationPrices;
