import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import {Prix} from "../../types/Prix";
import Station from "../../types/Station";
import parseStationPrices from "../../utils/parseStationPrices";
import openMap from "../../utils/openMap";
import FuelPresentation from "./FuelPresentation/FuelPresentation";
import {useData} from "../../context/DataContext";

interface Props {
    station: Station;
    onPress?: () => void;
}

export default function StationItem({ station, onPress }: Props) {
    const [prix, setPrix] = useState<Prix[]>([]);
    const {filteredData} = useData();
    useEffect(() => {
        setPrix(parseStationPrices(station));
    }, [station]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>{station.ville}</Text>
                <View style={styles.iconGroup}>
                    <TouchableOpacity onPress={() => openMap(station)} style={styles.itineraryIcon}>
                        <Ionicons name="navigate" size={20} color="#71c44c" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Ionicons name="location-sharp" size={16} color="#ccc" style={{ marginRight: 6, marginBottom: 2 }} />
                <Text style={styles.address}>{station.adresse}</Text>
            </View>

            <View>
                {prix && prix
                    .filter(item => item.nom === filteredData.fuelType)
                    .map((item, i) => (
                        <FuelPresentation item={item} key={i} />
                    ))
                }
            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#1e1e1e",
        width: "92%",
        marginBottom: 10,
        left: "4%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    title: {
        color: "#71c44c",
        fontSize: 18,
        fontWeight: "bold",
    },
    address: {
        color: "#ccc",
        fontSize: 14,
        marginBottom: 4,
    },
    hours: {
        color: "white",
        fontSize: 14,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    iconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itineraryIcon: {
        marginLeft: 8,
        padding: 4,
        borderRadius: 20,
    },
});
