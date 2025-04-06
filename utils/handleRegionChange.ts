import * as Location from 'expo-location';
import { LatLng } from 'react-native-maps';
import type MapView from 'react-native-maps';

export const handleRegionChange = async (
    r: LatLng,
    setZipCode: (zip: string) => void,
    zipDebounce: React.MutableRefObject<NodeJS.Timeout | null>,
    mapRef: React.RefObject<MapView>,
    setAltitude: (alt: number) => void,
) => {
    const lat = r.latitude;
    const lon = r.longitude;

    if (zipDebounce.current) clearTimeout(zipDebounce.current);

    zipDebounce.current = setTimeout(async () => {
        try {
            const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
            if (mapRef.current) {
                const camera = await mapRef.current.getCamera();
                const altitude = camera.altitude;
                console.log("🔍 Altitude actuelle :", altitude);
                if (!altitude) return;

                    setAltitude(altitude);


                if (addresses.length > 0) {
                    const address = addresses[0];
                    if (altitude < 10000 && address.postalCode) {
                        console.log("📍 Recherche par code postal :", address.postalCode);
                        setZipCode(address.postalCode);
                    } else if (altitude >= 10000 && altitude <= 25000 && address.city) {
                        console.log("🏙️ Recherche par ville :", address.city);
                        setZipCode(address.city);
                    } else if (altitude >= 100000 && altitude <= 200000 && address.subregion) {
                        console.log('Recherche par departement')
                        setZipCode(address.subregion);
                    }
                }
            }

        } catch (err) {
            console.error("Erreur reverse geocoding ou récupération caméra :", err);
        }
    }, 1000);
};
