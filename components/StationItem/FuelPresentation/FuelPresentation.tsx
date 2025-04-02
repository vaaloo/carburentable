import { View, Text, StyleSheet } from "react-native";
import { Prix } from "../../../types/Prix";

interface FuelPresentationProps {
    item: Prix;
    fuelInfo:any;
}

export default function FuelPresentation({ item, fuelInfo }: FuelPresentationProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{item.nom} : {item.valeur}€</Text>
            <Text style={styles.stats}>🔻 {fuelInfo[item.nom].min}€  🔺 {fuelInfo[item.nom].max}€  📊 {fuelInfo[item.nom].avg.toFixed(2)}€</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        margin: 6,
        borderRadius: 8,
        backgroundColor: "#f8f9fa",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    stats: {
        fontSize: 12,
        color: "#555",
    },
});