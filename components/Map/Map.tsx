import React, {useEffect, useState, forwardRef, ForwardedRef} from 'react';
import { StyleSheet, View, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker, Region, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import DataMarkers from "../DataMarkers/DataMarkers";

const Map = forwardRef(({ radius }: { radius: number }, ref: ForwardedRef<MapView>) =>  {
    const [region, setRegion] = useState<Region | null>(null);

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
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            } catch (error) {
                console.error("Erreur lors de l'obtention de la localisation :", error);
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            {region ? (
                <MapView
                    ref={ref}
                    style={styles.map}
                    region={region}
                    showsCompass={false}
                    showsUserLocation={true}
                    showsPointsOfInterest={false}

                >
                    <Circle
                        center={{ latitude: region.latitude, longitude: region.longitude }}
                        radius={radius}
                        fillColor={"rgba(0, 255, 0, 0.3)"}
                        strokeColor={"green"}
                    />
                    <DataMarkers />
                </MapView>
            ) : null}
        </View>
    );
});

export default Map;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
