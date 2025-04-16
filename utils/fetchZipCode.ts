
const visitedCoords = new Map<string, string | null>();
const fetchZipCode = async (lat: number, lon: number): Promise<string | null | undefined> => {
    const coordKey = `${lat}_${lon}`;
    if (visitedCoords.has(coordKey)) {
        const cached = visitedCoords.get(coordKey);
        if (cached) {
            console.log(`🔁 Repris du cache: ${coordKey} → ${cached}`);
        } else {
            console.log(`⚠️ Coordonnée sans code postal connue: ${coordKey}`);
        }
        return cached;
    }

    try {
        const response = await fetch(
            `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`
        );
        const data = await response.json();
        const postalCode = data.features?.[0]?.properties?.postcode ?? null;

        visitedCoords.set(coordKey, postalCode);
        if (postalCode) {
            console.log(`🆕 Code postal trouvé : ${coordKey} → ${postalCode}`);
        }
        return postalCode;
    } catch (err) {
        console.warn("❌ Erreur reverse geocoding :", err);
        visitedCoords.set(coordKey, null);
        return null;
    }
};

export default fetchZipCode;