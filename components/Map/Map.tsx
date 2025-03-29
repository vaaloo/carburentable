import React, {useEffect, useState, forwardRef, ForwardedRef} from 'react';
import { StyleSheet, View, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

const Map = forwardRef((props, ref: ForwardedRef<MapView>) =>  {
    const [region, setRegion] = useState<Region | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.log('Permission to access location was denied');
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
        })();
    }, []);

    return (
        <View style={styles.container}>
            {region && (
                <MapView ref={ref} style={styles.map} initialRegion={region}>
                    <Marker coordinate={region} title="Vous êtes ici" />
                </MapView>
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
});