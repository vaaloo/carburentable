import Station from "../types/Station";
import parseStationPrices from "./parseStationPrices";

interface StationWithVisibility extends Station {
    isVisible: boolean;
}
export default function getAllFuelTypeWithStationArray ({stations}: {stations: StationWithVisibility[]}) {

    const fuelTypes = new Set<string>();
    if (!stations) return [];
    stations.forEach(station => {
        parseStationPrices(station).forEach((item: { [x: string]: any }) =>{
            fuelTypes.add(item.nom)
        });
    })
    return Array.from(fuelTypes);
}