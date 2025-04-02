import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View, StyleSheet, Button} from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import {Prix} from "../../types/Prix";
import Station from "../../types/Station";
import parseStationPrices from "../../utils/parseStationPrices";
import openMap from "../../utils/openMap";
import FuelPresentation from "./FuelPresentation/FuelPresentation";

interface Props {
    station: Station;
    fuelInfo: any;
    onPress?: () => void;
}

export default function StationItem({ station, fuelInfo, onPress }: Props) {
    const [prix, setPrix] = useState<Prix[]>([]);
    console.log(fuelInfo);
    useEffect(() => {
        setPrix(parseStationPrices(station));
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
                    <FuelPresentation item={item} fuelInfo={fuelInfo} key={i} />

                ))}
            </View>
            <Button title="On y va" onPress={() => openMap(station)} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 14,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        width: "90%",
        marginBottom: 10,
        left: "5%"
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

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
});
