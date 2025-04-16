import { Region } from 'react-native-maps';
import React from "react";
import fetchZipCode from "./fetchZipCode";

let prevZipCodes: string[] = [];
const arraysEqual = (a: string[], b: string[]) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

export const handleRegionChange = async (
    region: Region,
    setZipCodes: (zips: string[]) => void,
    zipDebounce: React.MutableRefObject<NodeJS.Timeout | null>,
    isDragging: React.MutableRefObject<boolean>,
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
    setData: any
) => {
    if (!isDragging) return;
    if (zipDebounce.current) clearTimeout(zipDebounce.current);
    zipDebounce.current = setTimeout(async () => {
        const latMin = region.latitude - region.latitudeDelta / 2;
        const latMax = region.latitude + region.latitudeDelta / 2;
        const lonMin = region.longitude - region.longitudeDelta / 2;
        const lonMax = region.longitude + region.longitudeDelta / 2;

        const step = 0.02;
        const coordList: [number, number][] = [];

        for (let lat = latMin; lat <= latMax; lat += step) {
            for (let lon = lonMin; lon <= lonMax; lon += step) {
                const roundedLat = parseFloat(lat.toFixed(3));
                const roundedLon = parseFloat(lon.toFixed(3));
                coordList.push([roundedLat, roundedLon]);
            }
        }
        console.log(coordList);
        const zipResults = await Promise.allSettled(
            coordList.map(([lat, lon]) => fetchZipCode(lat, lon))
        );

        const zipSet = new Set<string>();
        zipResults.forEach(res => {
            if (res.status === "fulfilled" && res.value) {
                zipSet.add(res.value);
            }
        });

        const result = Array.from(zipSet).sort();
        console.log("✅ Codes postaux uniques trouvés :", result);

        setIsDragging(false);

        if (arraysEqual(prevZipCodes, result)) return;

        setData([]);
        setZipCodes(result);
        prevZipCodes = result;
    }, 500);
};
