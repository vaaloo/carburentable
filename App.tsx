import React, { useRef } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView from 'react-native-maps';
import Header from './layout/Header/Header';
import Map from './components/Map/Map';
import * as Location from 'expo-location';
import Footer from "./layout/Footer/Footer";
import {Colors} from "react-native/Libraries/NewAppScreen";

export default function App() {
    const mapRef = useRef<MapView>(null);

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

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Header onRecenter={handleRecenter} />
            <Map ref={mapRef} />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: 'relative',
    padding: 5,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.white,
    borderStyle: "solid",
    backgroundColor: '#fff',
  },
});
