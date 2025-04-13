import * as Location from 'expo-location';
import { Region } from 'react-native-maps';
import React from "react";

const visitedCoords = new Map<string, string | null>(); // clé: lat_lon, valeur: code postal ou null
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleRegionChange = async (
    region: Region,
    setZipCodes: (zips: string[]) => void,
    zipDebounce: React.MutableRefObject<NodeJS.Timeout | null>,
    isDragging: React.Dispatch<React.SetStateAction<boolean>>,
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (!isDragging) return;
    if (zipDebounce.current) clearTimeout(zipDebounce.current);

    zipDebounce.current = setTimeout(async () => {
        try {
            const latMin = region.latitude - region.latitudeDelta / 2;
            const latMax = region.latitude + region.latitudeDelta / 2;
            const lonMin = region.longitude - region.longitudeDelta / 2;
            const lonMax = region.longitude + region.longitudeDelta / 2;

            const step = 0.02;
            const zipSet = new Set<string>();

            for (let lat = latMin; lat <= latMax; lat += step) {
                for (let lon = lonMin; lon <= lonMax; lon += step) {
                    const coordKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`;

                    if (visitedCoords.has(coordKey)) {
                        const cachedZip = visitedCoords.get(coordKey);
                        if (cachedZip) {
                            zipSet.add(cachedZip);
                            console.log(`🔁 Repris du cache: ${coordKey} → ${cachedZip}`);
                        } else {
                            console.log(`⚠️ Coordonnée sans code postal connue: ${coordKey}`);
                        }
                        continue;
                    }

                    try {
                        const addr = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
                        const postalCode = addr[0]?.postalCode ?? null;

                        visitedCoords.set(coordKey, postalCode); // Cache le résultat

                        if (postalCode) {
                            console.log(`🆕 Code postal trouvé : ${coordKey} → ${postalCode}`);
                            zipSet.add(postalCode);
                        }
                    } catch (geoErr) {
                        console.warn("Erreur reverseGeocodeAsync :", geoErr);
                        visitedCoords.set(coordKey, null); // Marquer comme visité même si erreur
                    }

                    await delay(500);
                }
            }

            const result = Array.from(zipSet);
            console.log("✅ Codes postaux uniques trouvés :", result);
            setZipCodes(result);
            setIsDragging(false);

        } catch (err) {
            console.error("Erreur reverse geocoding :", err);
        }
    }, 500);
};
