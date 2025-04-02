import Station from "./Station";

export interface FuelInfo {
    min: number;
    max: number;
    avg: number;
    minStations: Station[];
    maxStations: Station[];
};