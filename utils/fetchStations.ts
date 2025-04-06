import Station from "../types/Station";

const stationCache: Record<string, Station[]> = {};

const fetchStations = async (zipCode: string): Promise<Station[]> => {
    if (stationCache[zipCode]) {
        console.log("📦 Stations chargées depuis le cache pour", zipCode);
        return stationCache[zipCode];
    }
    const encodedUri = encodeURI(
        `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/` +
        `prix-des-carburants-en-france-flux-instantane-v2/records?select=*&where=cp=${zipCode}`
    );

    try {
        const response = await fetch(encodedUri);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        console.log("📦 Stations mises à jour pour", zipCode);
        stationCache[zipCode] = data.results;
        return data.results;
    } catch (err) {
        console.error("Erreur lors du fetch des stations :", err);
        return [];
    }
};

export default fetchStations;