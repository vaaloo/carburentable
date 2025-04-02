import { LatLng } from "react-native-maps";

export const handleRegionChange = (
    r: LatLng,
    setZipCode: (zip: string) => void,
    zipDebounce: React.MutableRefObject<NodeJS.Timeout | null>
) => {
    const lat = r.latitude;
    const lon = r.longitude;

    if (zipDebounce.current) clearTimeout(zipDebounce.current);

    zipDebounce.current = setTimeout(() => {
        const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                const newZip = data.features[0]?.properties?.postcode;
                if (newZip) {
                    console.log("⛽️ Nouveau code postal :", newZip);
                    setZipCode(newZip); // Ce zip déclenche useFetchStations dans le DataContext
                }
            })
            .catch((err) => console.error("Erreur reverse geocoding :", err));
    }, 1500); // délai de 1.5s
};
