const visitedCoords = new Map<string, string | null>();

const requestQueue: (() => void)[] = [];
let requestsThisSecond = 0;

setInterval(() => {
    requestsThisSecond = 0;
    processQueue();
}, 1000);

function processQueue() {
    while (requestsThisSecond < 50 && requestQueue.length > 0) {
        const fn = requestQueue.shift();
        if (fn) {
            requestsThisSecond++;
            fn();
        }
    }
}

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        requestQueue.push(() => {
            fn().then(resolve).catch(reject);
        });
        processQueue();
    });
}

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

    return enqueue(async () => {
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
            console.warn("❌ Erreur :", err);
            visitedCoords.set(coordKey, null);
            return null;
        }
    });
};

export default fetchZipCode;
