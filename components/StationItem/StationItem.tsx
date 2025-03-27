import React, {useEffect, useState} from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import {Prix} from "../../types/Prix";
import Station from "../../types/Station";


interface Props {
    station: Station;
}

export default function StationItem({ station }: Props) {
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
        <View style={styles.container} >
            <Text style={styles.title}>{station.ville}</Text>
            <Text style={styles.address}>{station.adresse}</Text>

            <View>
                {prix && prix.map((item, i) => (
                    <Text key={i}>{item.nom} - {item.valeur}</Text>

                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    address: {
        fontSize: 16,
        marginBottom: 8,
    },
    hours: {
        fontSize: 14,
        color: "gray",
    },
    section: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    serviceItem: {
        fontSize: 14,
        marginBottom: 4,
    },
    fuelItem: {
        fontSize: 14,
        marginBottom: 4,
    },
});
