import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';

const useRegion = () => {
    const [region, setRegion] = useState<Region>();
    const [zipCode, setZipCode] = useState<string>();
    const [altitude, setAltitude] = useState<number | null>(null);

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

    return { region, setRegion, zipCode, setZipCode, altitude, setAltitude };
};

export default useRegion;