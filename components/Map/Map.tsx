import MapView from 'react-native-maps';
import React, {forwardRef, useEffect, useState, useRef} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import useLocationRegion from "../../hook/useLocationRegion";
import { useData } from "../../context/DataContext";
import fetchStations from "../../utils/fetchStations";
import StationMarker from "../StationMarker/StationMarker";
import {handleRegionChange} from "../../utils/handleRegionChange";

const Map = forwardRef<MapView>((props, ref) => {
    const { region, setZipCode, zipCode } = useLocationRegion();
    const { data, filteredData } = useData();
    const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
    const zipDebounce = useRef<NodeJS.Timeout | null>(null);
    const { setBaseData, isDragging, setIsDragging } = useData();

    useEffect(() => {

        if (!zipCode) return;
        console.log('lancement de fetch')
        fetchStations(zipCode).then((data) => {
            setBaseData(data);
        });
    }, [zipCode]);

    useEffect(() => {

        if (data && data.length > 0) {
            const bestStation = data.find(item => item.isVisible );
            if (bestStation) {
                setSelectedMarkerId(bestStation.id);
                // @ts-ignore
                ref?.current?.animateToRegion({
                    latitude: bestStation.geom.lat,
                    longitude: bestStation.geom.lon,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }, 1000);
            }
        }
    }, [data]);


    if (!region) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            {region ? (
                    <MapView
                        style={styles.map}
                        ref={ref}
                        showsPointsOfInterest={false}
                        pitchEnabled={false}
                        initialRegion={region}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        // @ts-ignore
                        onRegionChange={(r) => handleRegionChange(r, setZipCode,zipDebounce, isDragging, setIsDragging)}
                        loadingEnabled={true}
                        showsCompass={false}
                        onPanDrag={() => {
                            if (!isDragging) setIsDragging(true);
                        }}
                    >
                    {data && data.map((item, index) => (
                        <StationMarker
                            key={item.id}
                            item={item}
                            selectedMarkerId={selectedMarkerId}
                            setSelectedMarkerId={setSelectedMarkerId}
                            filteredData={filteredData}
                        />
                    ))}
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
    bestMarkerContainer: {
        padding: 5,
        backgroundColor: 'transparent',
        borderRadius: 20,
    },
    bestMarker: {
        width: 20,
        height: 20,
        backgroundColor: '#00C853',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white',
    },
    regularMarkerContainer: {
        padding: 5,
        backgroundColor: 'transparent',
        borderRadius: 15,
    },
    regularMarker: {
        width: 12,
        height: 12,
        backgroundColor: '#BDBDBD',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'white',
    },
    calloutContainer: {
        width: 150,
        padding: 10,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
    },
    bestPriceText: {
        color: 'green',
        fontWeight: 'bold',
        marginTop: 5,
    }
});
