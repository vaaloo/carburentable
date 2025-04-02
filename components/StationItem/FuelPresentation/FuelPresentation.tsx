import { View, Text, StyleSheet } from "react-native";
import { Prix } from "../../../types/Prix";
import { useData } from "../../../context/DataContext";

interface FuelPresentationProps {
    item: Prix;
}

export default function FuelPresentation({ item }: FuelPresentationProps) {
    const { fuelInfo } = useData();

    if (!fuelInfo || !fuelInfo[item.nom]) {
        return null;
    }

    const fuelStats = fuelInfo[item.nom];
    const { min, max, avg } = fuelStats;

    const minDiff = (((item.valeur as unknown as number - min) / min) * 100).toFixed(1);
    const maxDiff = (((item.valeur as unknown as number - max) / max) * 100).toFixed(1);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⛽️ {item.nom} : {item.valeur}€</Text>
            <Text style={styles.stats}>
                🔻 {min}€ ({minDiff}%)  🔺 {max}€ ({maxDiff}%)  📊 {avg.toFixed(2)}€
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginVertical: 6,
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
});
