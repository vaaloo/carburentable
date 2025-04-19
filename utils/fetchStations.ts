import Station from "../types/Station";

const stationCache: Record<string, Station[]> = {};

const fetchStations = async (zipCodes: string[]): Promise<Station[]> => {
    const newZipCodes = zipCodes.filter((zip) => !stationCache[zip]);
    console.log(zipCodes);
    let newStations: Station[] = [];

    if (newZipCodes.length > 0) {
        const zipInQuery = newZipCodes.map(zip => `'${zip}'`).join(',');
        const encodedUri = encodeURI(
            `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/` +
            `prix-des-carburants-en-france-flux-instantane-v2/records?select=*&where=cp in (${zipInQuery})`
        );

        try {
            const response = await fetch(encodedUri);
            if (!response.ok) throw new Error(response.statusText);
            const data = await response.json();
            newStations = data.results;

            // On split par code postal et on remplit le cacahe
            newZipCodes.forEach(zip => {
                stationCache[zip] = newStations.filter(station => station.cp === zip);
            });

            console.log("📦 Stations mises à jour pour :", newZipCodes.join(", "));
        } catch (err) {
            console.error("Erreur lors du fetch des stations :", err);
        }
    }
    return zipCodes.flatMap(zip => stationCache[zip] || []);
};

export default fetchStations;
