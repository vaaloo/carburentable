import * as Location from 'expo-location';
import { LatLng } from 'react-native-maps';

export const handleRegionChange = async (
    r: LatLng,
    setZipCode: (zip: string) => void,
    zipDebounce: React.MutableRefObject<NodeJS.Timeout | null>
) => {
    const lat = r.latitude;
    const lon = r.longitude;

    if (zipDebounce.current) clearTimeout(zipDebounce.current);

    zipDebounce.current = setTimeout(async () => {
        try {
            const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
            if (addresses.length > 0) {
                const newZip = addresses[0].postalCode;
                if (newZip) {
                    console.log("⛽️ Nouveau code postal :", newZip);
                    setZipCode(newZip);
                }
            }
        } catch (err) {
            console.error("Erreur reverse geocoding :", err);
        }
    }, 1000);
};
