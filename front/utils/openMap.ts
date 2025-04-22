import Station from "../../types/Station";
import {Linking, Platform} from "react-native";

const openMap = (item: Station) => {
    const address = encodeURIComponent(`${item.adresse}, ${item.ville}`);
    const url = Platform.select({
        ios: `maps:0,0?q=${address}`,
        android: `geo:0,0?q=${address}`
    });

    if (url) {
        Linking.openURL(url).catch(err => console.error("Erreur lors de l'ouverture de la carte :", err));
    }
};
export default openMap;