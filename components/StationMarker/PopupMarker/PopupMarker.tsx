import { Text, View, StyleSheet, Button, Linking, Platform } from "react-native";
import React from "react";

interface PopupMarkerProps {
    item: { adresse?: string; ville?: string };
    isBestStation: boolean;
    fuelType?: string;
}

export default function PopupMarker({ item, isBestStation, fuelType }: PopupMarkerProps) {

    const openMap = () => {
        const address = encodeURIComponent(`${item.adresse}, ${item.ville}`);
        const url = Platform.select({
            ios: `maps:0,0?q=${address}`,
            android: `geo:0,0?q=${address}`
        });

        if (url) {
            Linking.openURL(url).catch(err => console.error("Erreur lors de l'ouverture de la carte :", err));
        }
    };


    return (
        <View style={styles.calloutContainer}>
            <Text style={styles.calloutTitle}>Station</Text>
            <Text>{item.adresse || ''}</Text>
            <Text>{item.ville || ''}</Text>
            {isBestStation && (
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
