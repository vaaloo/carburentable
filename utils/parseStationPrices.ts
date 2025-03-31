import {Prix} from "../types/Prix";
import Station from "../types/Station";

const parseStationPrices = (station: Station): Prix[] => {
    return JSON.parse(station.prix).map((item: { [x: string]: any }) =>
        Object.keys(item).reduce((acc, key) => {
            // @ts-ignore
            acc[key.replace("@", "")] = item[key];
            return acc;
        }, {} as Prix)
    );
};

export default parseStationPrices;