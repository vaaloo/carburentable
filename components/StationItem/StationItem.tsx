import React, {useEffect, useState} from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import {Prix} from "../../types/Prix";
import Station from "../../types/Station";

interface Props {
    station: Station;
    onPress?: () => void;
}

export default function StationItem({ station, onPress }: Props) {
    const [prix, setPrix] = useState<Prix[]>([]);
    useEffect(() => {
        setPrix(
            JSON.parse(station.prix).map((item: { [x: string]: any; }) =>
                Object.keys(item).reduce((acc, key) => {
                    // @ts-ignore
                    acc[key.replace("@", "")] = item[key];
                    return acc;
                }, {})
            )
        );
    }, [station]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>{station.ville}</Text>
                <FontAwesome5 name="gas-pump" size={20} color="#90ee90" />
            </View>
            <Text style={styles.address}>{station.adresse}</Text>

            <View>
                {prix && prix.map((item, i) => (
                    <Text key={i} style={styles.fuelItem}>{item.nom} - {item.valeur} €</Text>

                ))}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 14,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        marginBottom: 10,
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    address: {
        color: "white",
        fontSize: 16,
        marginBottom: 8,
    },
    hours: {
        color: "white",
        fontSize: 14,
    },
    fuelItem: {
        color: "#90ee90",
        fontSize: 14,
        marginBottom: 4,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
});
