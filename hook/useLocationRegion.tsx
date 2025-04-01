import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import {Region} from "react-native-maps";

const useLocationRegion = () => {
    const [region, setRegion] = useState<Region>();

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

                console.log(Location.LocationGeofencingRegionState);
            } catch (error) {
                console.error("Erreur lors de l'obtention de la localisation :", error);
            }
        })();
    }, []);

    return region;
};

export default useLocationRegion;
