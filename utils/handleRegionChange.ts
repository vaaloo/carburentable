import * as Location from 'expo-location';
import { Region } from 'react-native-maps';
import type MapView from 'react-native-maps';

const visitedCoords = new Set<string>();

export const handleRegionChange = async (
    region: Region,
    setZipCodes: (zips: string[]) => void,
    zipDebounce: React.MutableRefObject<NodeJS.Timeout | null>,
    mapRef: React.RefObject<MapView>,
) => { //TODO modif ici pour ne plus avoir l'erreur: too many requests soit faire en sorte d'appeler avec un timeout , soit prendre moins de point
    if (zipDebounce.current) clearTimeout(zipDebounce.current);

    zipDebounce.current = setTimeout(async () => {
        try {
            const latDelta = region.latitudeDelta / 2;
            const lonDelta = region.longitudeDelta / 2;

            // Points clés : centre + 4 coins
            const points = [
                { latitude: region.latitude, longitude: region.longitude }, // centre
                { latitude: region.latitude - latDelta, longitude: region.longitude - lonDelta }, // top-left
                { latitude: region.latitude - latDelta, longitude: region.longitude + lonDelta }, // top-right
                { latitude: region.latitude + latDelta, longitude: region.longitude - lonDelta }, // bottom-left
                { latitude: region.latitude + latDelta, longitude: region.longitude + lonDelta }, // bottom-right
            ];

            const uniquePoints = points.filter(p => {
                const key = `${p.latitude.toFixed(3)},${p.longitude.toFixed(3)}`;
                if (visitedCoords.has(key)) return false;
                visitedCoords.add(key);
                return true;
            });

            const allAddresses = await Promise.all(uniquePoints.map((p) => Location.reverseGeocodeAsync(p)));
            const zipSet = new Set<string>();

            allAddresses.forEach((addrArray) => {
                if (addrArray[0]?.postalCode) {
                    zipSet.add(addrArray[0].postalCode);
                }
            });

            setZipCodes(Array.from(zipSet));
        } catch (err) {
            console.error("Erreur reverse geocoding dans la zone :", err);
        }
    }, 1000);
};
