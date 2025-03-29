import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, {Circle, Marker, Region, LatLng} from 'react-native-maps';
import * as Location from 'expo-location';
import DataMarkers from "../DataMarkers/DataMarkers";

export default function Map() {
    const [region, setRegion] = useState<Region | null>(null);
    const [latlng, setLatlng] = useState<LatLng>();

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.warn('Permission to access location was denied');
                    setRegion({
                        latitude: 48.8566,
                        longitude: 2.3522,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                    setLatlng(
                        {
                            latitude: 48.8566,
                            longitude: 2.3522,

                        }
                    )
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
                setLatlng(
                    {

                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,

                    }
                )
            } catch (error) {
                console.error("Erreur lors de l'obtention de la localisation :", error);
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            {region ? (
                <MapView style={styles.map} initialRegion={region}>
                    {latlng && <Circle
                        center={latlng}
                        radius={50}
                        fillColor={"rgba(0, 255, 0, 0.3)"}
                        strokeColor={"green"}
                    /> }

                    <DataMarkers />
                </MapView>
            ) : (
                <View style={styles.loadingContainer}>
                </View>
            )}
        </View>
    );
}

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
