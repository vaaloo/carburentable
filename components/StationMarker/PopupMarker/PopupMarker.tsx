import { Text, View, StyleSheet, Button, Linking, Platform } from "react-native";
import React from "react";
import Station from "../../../types/Station";

interface PopupMarkerProps {
    item: Station;
    fuelType?: string;
}

export default function PopupMarker({ item, fuelType }: PopupMarkerProps) {
    return (
        <View style={styles.calloutContainer}>
            <Text style={styles.calloutTitle}>Station</Text>
            <Text>{item.adresse || ''}</Text>
            <Text>{item.ville || ''}</Text>
            {item.isBest && (
                <Text style={styles.bestPriceText}>
                    Meilleur prix {fuelType}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    calloutContainer: {
        width: 150,
        padding: 10,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
    },
    bestPriceText: {
        color: 'green',
        fontWeight: 'bold',
        marginTop: 5,
    },
});
