import MapView, { Marker, Callout } from 'react-native-maps';
import React, { forwardRef, ForwardedRef, useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import useLocationRegion from "../../hook/useLocationRegion";
import { useData } from "../../context/DataContext";

const Map = forwardRef(({ radius }: { radius: number }, ref: ForwardedRef<MapView>) => {
    const region = useLocationRegion();
    const { data, filteredData } = useData();
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

    useEffect(() => {
        console.log("Map effect, data length:", data?.length);

        if (data && data.length > 0) {
            const bestStation = data.find(item => item.isVisible );
            if (bestStation) {
                // @ts-ignore
                setSelectedMarkerId(bestStation.id);
            }
        }
    }, [data]);

    const renderMarker = (item: any, index: number) => {
        const isBestStation = item.isVisible === true;

        return (
            <Marker
                key={item.id}
                identifier={item.id}
                coordinate={{
                    latitude: typeof item.geom.lat === 'string' ? parseFloat(item.geom.lat) : item.geom.lat,
                    longitude: typeof item.geom.lon === 'string' ? parseFloat(item.geom.lon) : item.geom.lon,
                }}
                pinColor={isBestStation ? 'green' : 'gray'}
                zIndex={isBestStation ? 2 : 1}
                tracksViewChanges={false}
                onPress={() => setSelectedMarkerId(item.id)}
                ref={markerRef => {
                    if (markerRef && filteredData.is_best && item.id === selectedMarkerId) {
                        setTimeout(() => markerRef.showCallout(), 500);
                    }
                }}
            >
                {isBestStation ? (
                    <View style={styles.bestMarkerContainer}>
                        <View style={styles.bestMarker} />
                    </View>
                ) : (
                    <View style={styles.regularMarkerContainer}>
                        <View style={styles.regularMarker} />
                    </View>
                )}
                <Callout>
                    <View style={styles.calloutContainer}>
                        <Text style={styles.calloutTitle}>{item.marque || 'Station'}</Text>
                        <Text>{item.adresse || ''}</Text>
                        <Text>{item.ville || ''}</Text>
                        {isBestStation && (
                            <Text style={styles.bestPriceText}>
                                Meilleur prix {filteredData.fuelType}
                            </Text>
                        )}
                    </View>
                </Callout>
            </Marker>
        );
    };

    return (
        <View style={styles.container}>
            {region ? (
                <MapView
                    style={styles.map}
                    initialRegion={region}
                    ref={ref}
                    showsPointsOfInterest={false}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    loadingEnabled={true}
                    showsCompass={false}
                >
                    {data && data.map(renderMarker)}
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