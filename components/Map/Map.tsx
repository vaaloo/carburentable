import MapView, { Circle, LatLng, Region } from 'react-native-maps';
import React, { forwardRef, ForwardedRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import useLocationRegion from "../../hook/useLocationRegion";
import DataMarkers from "../DataMarkers/DataMarkers";

const Map = forwardRef(({ radius }: { radius: number }, ref: ForwardedRef<MapView>) => {
    const region = useLocationRegion();

    return (
        <View style={styles.container}>
            {region ? (
                <MapView style={styles.map} initialRegion={region} ref={ref}>
                    <Circle
                        center={{ latitude: region.latitude, longitude: region.longitude } as LatLng}
                        radius={radius}
                        fillColor={"rgba(0, 255, 0, 0.3)"}
                        strokeColor={"green"}
                    />
                    <DataMarkers />
                </MapView>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        </View>
    );
});

export default Map;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
