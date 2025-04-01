import { useEffect, useState } from 'react';
import Station from "../types/Station";
import useLocationRegion from "./useLocationRegion";

const useFetchStations = (z: string | undefined) => {
    const { region } = useLocationRegion();
    const [baseData, setBaseData] = useState<Station[]>([]);

    useEffect(() => {
        let active = true;

        const fetchWithZip = async (zip: string) => {
            const encodedUri = encodeURI(
                `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/` +
                `prix-des-carburants-en-france-flux-instantane-v2/records?select=*&where=cp=${zip}`
            );

            try {
                const response = await fetch(encodedUri);
                if (!response.ok) throw new Error(response.statusText);
                const data = await response.json();
                if (active) {
                    console.log("📦 Stations mises à jour pour le code postal :", zip);
                    setBaseData(data.results);
                }
            } catch (err) {
                console.error("Erreur lors du fetch des stations :", err);
            }
        };

        if (z) {
            fetchWithZip(z);
        } else if (region?.longitude && region?.latitude) {
            const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${region.longitude}&lat=${region.latitude}`;
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    const zip = data.features[0]?.properties?.postcode;
                    if (zip) {
                        console.log("🔄 Code postal obtenu via reverse geocoding :", zip);
                        fetchWithZip(zip);
                    }
                })
                .catch(err => console.error("Erreur reverse geocoding :", err));
        }

        return () => {
            active = false; // pour éviter de setState si le composant est démonté
        };
    }, [z, region]);

    return baseData;
};

export default useFetchStations;