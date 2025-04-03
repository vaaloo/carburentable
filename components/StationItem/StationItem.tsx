import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
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
                    <FontAwesome5 name="gas-pump" size={20} color="#90ee90" />
                    <TouchableOpacity onPress={() => openMap(station)} style={styles.itineraryIcon}>
                        <Ionicons name="navigate" size={20} color="#90ee90" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Ionicons name="location-sharp" size={16} color="#ccc" style={{ marginRight: 6 }} />
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
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#1e1e1e",
        width: "92%",
        marginBottom: 14,
        left: "4%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    title: {
        color: "#90ee90",
        fontSize: 20,
        fontWeight: "bold",
    },
    address: {
        color: "#ccc",
        fontSize: 15,
        marginBottom: 8,
        marginTop: 2,
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
