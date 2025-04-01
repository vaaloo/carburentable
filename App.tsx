import React, { useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView from 'react-native-maps';
import Header from './layout/Header/Header';
import Map from './components/Map/Map';
import * as Location from 'expo-location';
import Footer from "./layout/Footer/Footer";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {DataProvider} from "./context/DataContext";
import {LocationProvider} from "./context/LocationContext";

export default function App() {
    const mapRef = useRef<MapView>(null);
    const [radius, setRadius] = useState(50);

    const handleRangeChange = (km: number) => setRadius(km * 1000);

    const handleRecenter = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            mapRef.current?.animateToRegion({
                latitude: 48.8566,
                longitude: 2.3522,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        mapRef.current?.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
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
        <DataProvider>

            <View style={styles.container}>
                <StatusBar style="auto" />
                <Header onRecenter={handleRecenter} onRangeChange={handleRangeChange} />
                <Map ref={mapRef} radius={radius} />
                <Footer onStationClicked={onStationClicked}/>
            </View>

        </DataProvider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
