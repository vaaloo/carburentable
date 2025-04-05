import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import { Filtered } from "../../types/Filtered";
import PopupMarker from "./PopupMarker/PopupMarker";
import Station from "../../types/Station";


interface StationMarkerProps {
    item: Station;
    selectedMarkerId: number | null;
    setSelectedMarkerId: (id: number) => void;
    filteredData: Filtered;
}

const StationMarker: React.FC<StationMarkerProps> = ({ item, selectedMarkerId, setSelectedMarkerId, filteredData }) => {


    return (
        <Marker
            key={item.id}
            coordinate={{
                latitude: item.geom.lat,
                longitude: item.geom.lon,
            }}
            pinColor={item.isVisible ? 'green' : 'gray'}
            zIndex={item.isVisible ? 2 : 1}
            tracksViewChanges={false}
            onPress={() => setSelectedMarkerId(item.id)}
            ref={markerRef => {
                if (markerRef && filteredData.is_best && item.id === selectedMarkerId) {
                    setTimeout(() => markerRef.showCallout(), 500);
                }
            }}
        >
            {item.isVisible ? (
                <View style={styles.bestMarkerContainer}>
                    <View style={styles.bestMarker} />
                </View>
            ) : (
                <View style={styles.regularMarkerContainer}>
                    <View style={styles.regularMarker} />
                </View>
            )}
            <Callout tooltip>
                <PopupMarker item={item} fuelType={filteredData.fuelType} />
            </Callout>
        </Marker>
    );
};

const styles = StyleSheet.create({
    bestMarkerContainer: {
        padding: 5,
        backgroundColor: 'transparent',
        borderRadius: 20,
    },
    bestMarker: {
        width: 20,
        height: 20,
        backgroundColor: '#00C853',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white',
    },
    regularMarkerContainer: {
        padding: 5,
        backgroundColor: 'transparent',
        borderRadius: 15,
    },
    regularMarker: {
        width: 12,
        height: 12,
        backgroundColor: '#BDBDBD',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'white',
    },
});

export default StationMarker;
