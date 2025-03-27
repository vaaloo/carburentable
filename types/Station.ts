import {Prix} from "./Prix";


export default interface Station {
    id: number;
    latitude: string;
    longitude: string;
    cp: string;
    pop: string;
    adresse: string;
    ville: string;
    services: string | null;
    prix: string;
    rupture: {
        nom: string;
        id: string;
        debut: string;
        fin: string;
        type: string;
    };
    horaires: {
        "automate-24-24": string;
        jour: Array<{
            id: string;
            nom: string;
            ferme: string;
        }>;
    };
    geom: {
        lon: number;
        lat: number;
    };
    horaires_automate_24_24: string;
    departement: string;
    code_departement: string;
    region: string;
    code_region: string;
}
