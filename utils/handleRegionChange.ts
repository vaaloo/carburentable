import * as Location from 'expo-location';
import { Region } from 'react-native-maps';
import React from "react";

const visitedCoords = new Set<string>();
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleRegionChange = async (
    region: Region,
    setZipCodes: (zips: string[]) => void,
    zipDebounce: React.MutableRefObject<NodeJS.Timeout | null>,
    previousZipCodesRef: React.MutableRefObject<string[]>,
    isDragging: React.Dispatch<React.SetStateAction<boolean>>,
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
) => { //TODO mettre un isLoading et faire en sorte d'enlever toute les animations
    if (!isDragging) return;
    if (zipDebounce.current) clearTimeout(zipDebounce.current);

    zipDebounce.current = setTimeout(async () => {
        try {
            console.log('is loading true')
            const latMin = region.latitude - region.latitudeDelta / 2;
            const latMax = region.latitude + region.latitudeDelta / 2;
            const lonMin = region.longitude - region.longitudeDelta / 2;
            const lonMax = region.longitude + region.longitudeDelta / 2;

            const step = 1;
            const zipSet = new Set<string>();

            for (let lat = latMin; lat <= latMax; lat += step) {
                for (let lon = lonMin; lon <= lonMax; lon += step) {
                    const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
                    if (visitedCoords.has(key)) continue;
                    visitedCoords.add(key);

                    try {
                        const addr = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
                        if (addr[0]?.postalCode) {
                            zipSet.add(addr[0].postalCode);
                        }
                    } catch (geoErr) {
                        console.warn("Erreur reverseGeocodeAsync :", geoErr);
                    }

                    await delay(1500); // Délai pour éviter les blocages API
                }
            }

            const newZips = Array.from(zipSet).sort();
            const prevZips = (previousZipCodesRef.current ?? []).slice().sort();

            const isSame =
                newZips.length === prevZips.length &&
                newZips.every((zip, i) => zip === prevZips[i]);

            if (!isSame) {
                previousZipCodesRef.current = newZips;
                setZipCodes(newZips);
                setIsDragging(false);
            }

        } catch (err) {
            console.error("Erreur reverse geocoding dans la zone :", err);
        }
    }, 500);
};
