import React, {useEffect, useState} from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
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
            <Text style={styles.title}>{station.ville}</Text>
            <Text style={styles.address}>{station.adresse} - {station.geom.lat} - {station.geom.lon}</Text>

            <View>
                {prix && prix.map((item, i) => (
                    <Text key={i} style={styles.fuelItem}>{item.nom} - {item.valeur}</Text>

                ))}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
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
        color: "white",
        fontSize: 14,
        marginBottom: 4,
    },
});
