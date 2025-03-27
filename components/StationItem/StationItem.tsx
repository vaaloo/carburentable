import React, { useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface Props {
    station: {
        adresse: string;
        ville: string;
        services_service: string[];
        carburants_disponibles: string[];
        carburants_indisponibles: string[];
        horaires_jour: string;
    };
}

export default function StationItem({ station }: Props) {
    useEffect(() => {
        console.log("StationItem", station);
    }, [station]);

    return (
        <View style={styles.container} >
            <Text style={styles.title}>{station.ville}</Text>
            <Text style={styles.address}>{station.adresse}</Text>
            <Text style={styles.hours}>{station.horaires_jour}</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Services:</Text>
                {station.services_service.map((service, index) => (
                    <Text key={index} style={styles.serviceItem}>
                        {service}
                    </Text>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Available Fuels:</Text>
                {station.carburants_disponibles.map((fuel, index) => (
                    <Text key={index} style={styles.fuelItem}>
                        {fuel}
                    </Text>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Unavailable Fuels:</Text>
                {station.carburants_indisponibles.map((fuel, index) => (
                    <Text key={index} style={styles.fuelItem}>
                        {fuel}
                    </Text>
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
