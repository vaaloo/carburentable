import { View, Text, StyleSheet } from "react-native";
import { useData } from "../../../context/DataContext";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import {Prix} from "../../../../types/Prix";

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
    const avgDiff = (((item.valeur as unknown as number - avg) / avg) * 100).toFixed(1);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <FontAwesome5 name="gas-pump" size={14} color="#71c44c" />
                <Text style={styles.fuelLabel}>{item.nom}</Text>
                <Text style={styles.price}>-  {item.valeur}€</Text>
                <Text style={styles.avgDiff}>({avgDiff}%)</Text>
            </View>
            <View style={styles.stats}>
                <View style={styles.statItem}>
                    <Ionicons name="arrow-down" size={12} color="#71c44c" />
                    <Text style={styles.statText}>{min}€</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="arrow-up" size={12} color="#e67e22" />
                    <Text style={styles.statText}>{max}€</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="stats-chart" size={12} color="#3498db" />
                    <Text style={styles.statText}>{avg.toFixed(2)}€</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#292929",
        marginVertical: 6,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 4,
    },
    fuelLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#fff",
    },
    price: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
    },
    avgDiff: {
        fontSize: 12,
        color: "#aaa",
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 2,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: "#ccc",
    },
});