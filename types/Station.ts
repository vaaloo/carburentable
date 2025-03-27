interface FuelPrice {
    "nom": string;
    "id": string;
    "maj": string;
    "valeur": string;
}

interface Rupture {
    "nom": string;
    "id": string;
    "debut": string;
    "fin": string;
    "type": string;
}

interface Jour {
    "id": string;
    "nom": string;
    "ferme": string;
}

interface Horaires {
    "automate-24-24": string;
    jour: Jour[];
}

interface Geom {
    lon: number;
    lat: number;
}

interface Station {
    id: number;
    latitude: string;
    longitude: string;
    cp: string;
    pop: string;
    adresse: string;
    ville: string;
    services: string | null;
    prix: FuelPrice[];
    rupture: Rupture;
    horaires: Horaires;
    geom: Geom;
    horaires_automate_24_24: string;
    departement: string;
    code_departement: string;
    region: string;
    code_region: string;
}
