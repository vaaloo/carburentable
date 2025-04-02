import { Text, View, StyleSheet } from "react-native";
import React from "react";

interface PopupMarkerProps {
    item: { adresse?: string; ville?: string };
    isBestStation: boolean;
    fuelType?: string;
}

export default function PopupMarker({ item, isBestStation, fuelType }: PopupMarkerProps) { //TODO ici fix le probleme il affiche pas le meilleurs prix alors qu'il comprend bien que l'item est isBestStation ??
    if (isBestStation) {
        return (
            <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>Station</Text>
                <Text>{item.adresse || ''}</Text>
                <Text>{item.ville || ''}</Text>

                <Text style={styles.bestPriceText}>
                    Meilleur prix {fuelType}
                </Text>
            </View>
        )
    }
    return (
        <View style={styles.calloutContainer}>
            <Text style={styles.calloutTitle}>Station</Text>
            <Text>{item.adresse || ''}</Text>
            <Text>{item.ville || ''}</Text>
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
