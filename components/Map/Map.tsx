import MapView, { LatLng } from 'react-native-maps';
import React, { forwardRef, ForwardedRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import useLocationRegion from "../../hook/useLocationRegion";
import DataMarkers from "../DataMarkers/DataMarkers";

const Map = forwardRef(({ radius }: { radius: number }, ref: ForwardedRef<MapView>) => {
    const region = useLocationRegion();

    return (
        <View style={styles.container}>
            {region ? (
                <MapView
                    style={styles.map}
                    initialRegion={region} ref={ref}
                    showsPointsOfInterest={false}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    onRegionChange={(r) => {
                        const lat = r.latitude;
                        const lon = r.longitude;
                        const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`;
                        fetch(url)
                            .then((response) => response.json())
                            .then((data) => {
                                console.log(data.features[0].properties.postcode);
                            });
                    }}
                    loadingEnabled={true}
                    showsCompass={false}
                >
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
