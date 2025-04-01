import MapView, {Marker, Callout, LatLng} from 'react-native-maps';
import React, {forwardRef, ForwardedRef, useEffect, useState, useRef} from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import useLocationRegion from "../../hook/useLocationRegion";
import { useData } from "../../context/DataContext";
import fetchStations from "../../utils/fetchStations";

const Map = forwardRef(({ radius }: { radius: number }, ref: ForwardedRef<MapView>) => {
    const { region, setZipCode, zipCode } = useLocationRegion();
    const { data, filteredData } = useData();
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
    const zipDebounce = useRef<NodeJS.Timeout | null>(null);
    const { setBaseData } = useData();

    useEffect(() => {
        if (!zipCode) return;

        fetchStations(zipCode).then((data) => {
            setBaseData(data);
        });
    }, [zipCode]);

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

    if (!region) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const handleRegionChange = (r: LatLng) => {
        const lat = r.latitude;
        const lon = r.longitude;

        // Debounce l’appel API + setZipCode
        if (zipDebounce.current) clearTimeout(zipDebounce.current);

        zipDebounce.current = setTimeout(() => {
            const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`;
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    const newZip = data.features[0]?.properties?.postcode;
                    if (newZip) {
                        console.log("⛽️ Nouveau code postal :", newZip);
                        setZipCode(newZip); // Ce zip déclenche useFetchStations dans le DataContext
                    }
                })
                .catch((err) => console.error("Erreur reverse geocoding :", err));
        }, 1500); // délai de 1.5s
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
                        onRegionChange={handleRegionChange}
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
