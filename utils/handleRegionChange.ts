import * as Location from 'expo-location';
import { LatLng } from 'react-native-maps';
import type MapView from 'react-native-maps';

export const handleRegionChange = async (
    r: LatLng,
    setZipCode: (zip: string) => void,
    zipDebounce: React.MutableRefObject<NodeJS.Timeout | null>,
    mapRef: React.RefObject<MapView>,
) => {
    const lat = r.latitude;
    const lon = r.longitude;

    if (zipDebounce.current) clearTimeout(zipDebounce.current);

    zipDebounce.current = setTimeout(async () => {
        try {
            const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
            if (!addresses[0].postalCode) return;
            setZipCode(addresses[0].postalCode)

        } catch (err) {
            console.error("Erreur reverse geocoding ou récupération caméra :", err);
        }
    }, 1000);
};
