import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {StyleSheet, View, Dimensions, Text, Animated} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView from 'react-native-maps';
import Header from './layout/Header/Header';
import Map from './components/Map/Map';
import * as Location from 'expo-location';
import Footer from "./layout/Footer/Footer";
import {DataProvider} from "./context/DataContext";
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function App() {
    const mapRef = useRef<MapView>(null);

    const [zoomLevel, setZoomLevel] = useState<number | null>(null);

    const getZoomLevel = async () => {
        if (!mapRef.current) return;
        const camera = await mapRef.current.getCamera();
        if (!camera.altitude) return;
        setZoomLevel(camera.altitude);
        console.log(zoomLevel);
    };

    getZoomLevel();

    const handleRecenter = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            mapRef.current?.animateToRegion({
                latitude: 48.8566,
                longitude: 2.3522,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05
            });
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        mapRef.current?.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        });
    };

    const onStationClicked = (lat: number, lon: number) => {
        mapRef.current?.animateToRegion({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
        });
    };

    return (
        <SafeAreaProvider>
            <DataProvider>

                <View style={styles.container}>
                    <StatusBar style="auto" />
                    <Header onRecenter={handleRecenter} />
                    <Map ref={mapRef} />
                    <Footer onStationClicked={onStationClicked}/>
                </View>

            </DataProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
