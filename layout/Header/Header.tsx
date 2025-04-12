import React, {useState, useRef, useEffect, useContext} from 'react';
import { Animated, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Filter from "../../components/Filter/Filter";
import * as Location from "expo-location";
import {useData} from "../../context/DataContext";
import MapView from "react-native-maps";

export default function Header({
    mapRef
}: {
    mapRef: MapView;
}) {
    const [filterVisible, setFilterVisible] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const {isDragging, setIsDragging} = useData()
    useEffect(() => {
      Animated.timing(opacity, {
        toValue: filterVisible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, [filterVisible]);
    const onRecenter = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            mapRef.current?.animateToRegion({ // ici c'est prcq mapRef c'est MapView.ref et pas MapView tout court je penses a creuser j'ai pas le temps mtn
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

        if(!isDragging) {
            setIsDragging(true);
        }
    };
    return (
        <View style={styles.header}>
            <View style={styles.leftButtons}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setFilterVisible(!filterVisible)}>
                    <Ionicons name={filterVisible ? "close" : "filter"} size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={onRecenter}>
                    <Ionicons name="locate" size={24} color="#fff" />
                </TouchableOpacity>
                <Animated.View style={{ opacity }}>
                  {filterVisible && <Filter />}
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftButtons: {
        flexDirection: 'column',

        gap: 12,
        padding: 12,
        borderRadius: 20,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});