import Station from "../../types/Station";
import parseStationPrices from "./parseStationPrices";
import {FuelInfo} from "../../types/FuelInfo";



export default function getFuelInfo({ stations }: { stations: Station[] }) {
    if (!stations) return {};

    const fuelData: Record<string, FuelInfo & { total: number; count: number }> = {};

    stations.forEach(station => {
        parseStationPrices(station).forEach((item) => {
            const value = Number(item.valeur);

            if (!fuelData[item.nom]) {
                fuelData[item.nom] = {
                    min: value,
                    max: value,
                    avg: value,
                    minStations: [station],
                    maxStations: [station],
                    total: value,
                    count: 1
                };
            } else {
                // Gestion du minimum
                if (value < fuelData[item.nom].min) {
                    fuelData[item.nom].min = value;
                    fuelData[item.nom].minStations = [station];
                } else if (value === fuelData[item.nom].min) {
                    fuelData[item.nom].minStations.push(station);
                }

                // Gestion du maximum
                if (value > fuelData[item.nom].max) {
                    fuelData[item.nom].max = value;
                    fuelData[item.nom].maxStations = [station];
                } else if (value === fuelData[item.nom].max) {
                    fuelData[item.nom].maxStations.push(station);
                }

                fuelData[item.nom].total += value;
                fuelData[item.nom].count += 1;
                fuelData[item.nom].avg = fuelData[item.nom].total / fuelData[item.nom].count;
            }
        });
    });

    return Object.keys(fuelData).reduce((acc, key) => {
        const { total, count, ...fuelInfo } = fuelData[key];
        acc[key] = fuelInfo;
        return acc;
    }, {} as Record<string, FuelInfo>);
}
