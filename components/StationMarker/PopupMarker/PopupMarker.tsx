import { Text, View, StyleSheet } from "react-native";
import React from "react";
import Station from "../../../types/Station";

interface PopupMarkerProps {
    item: Station;
    fuelType?: string;
}

export default function PopupMarker({ item, fuelType }: PopupMarkerProps) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>Station</Text>
                <Text style={styles.text}>{item.adresse || ''}</Text>
                <Text style={styles.text}>{item.ville || ''}</Text>
                {item.isBest && (
                    <Text style={styles.bestPriceText}>
                        Meilleur prix {fuelType}
                    </Text>
                )}
            </View>
            <View style={styles.arrow} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
    },
    calloutContainer: {
        width: 150,
        padding: 10,
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#1e1e1e',
        marginTop: -1,
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
    text: {
        color: '#f0f0f0',
        fontSize: 13,
    },
});
