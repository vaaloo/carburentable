import { View, Text, StyleSheet } from "react-native";
import { Prix } from "../../../types/Prix";

interface FuelPresentationProps {
    item: Prix;
    fuelInfo:any;
}

export default function FuelPresentation({ item, fuelInfo }: FuelPresentationProps) {
    if (!fuelInfo) {
        return null;
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>⛽️ {item.nom} : {item.valeur}€</Text>
            <Text style={styles.stats}>🔻 {fuelInfo[item.nom].min}€  🔺 {fuelInfo[item.nom].max}€  📊 {fuelInfo[item.nom].avg.toFixed(2)}€</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginVertical: 6,
        marginHorizontal: 0,
        borderRadius: 10,
        backgroundColor: "#292929",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#f0f0f0",
        marginBottom: 4,
    },
    stats: {
        fontSize: 13,
        color: "#bbb",
    },
    itineraryIcon: {
        padding: 4,
        borderRadius: 20,
        backgroundColor: "#2a2a2a",
    },
});