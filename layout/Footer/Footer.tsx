import React, { useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet, ScrollView, View, Text, Platform, Linking, ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";
import StationItem from "../../components/StationItem/StationItem";
import { useData } from "../../context/DataContext";
import { Filtered } from "../../types/Filtered";
import Station from "../../types/Station";
import getFuelInfo from "../../utils/getFuelInfo";

export default function Footer({ onStationClicked }: { onStationClicked: (lat: number, lon: number) => void }) {
    const { data, setFilteredData } = useData();
    const [height] = useState(new Animated.Value(Dimensions.get("window").height * 0.25));
    const touchStartY = useRef(0);
    const dataReel = data.filter((item) => item.isVisible);


    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => {
                touchStartY.current = gestureState.y0;
                return touchStartY.current <= 20;
            },
            onMoveShouldSetPanResponder: () => false,
            onPanResponderMove: (evt, gestureState) => {
                const newHeight = Math.max(
                    Dimensions.get("window").height * 0.25,
                    // @ts-ignore
                    Math.min(Dimensions.get("window").height * 0.4, height._value - gestureState.dy)
                );
                height.setValue(newHeight);
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy < -50) {
                    Animated.spring(height, {
                        toValue: Dimensions.get("window").height * 0.4,
                        useNativeDriver: false,
                    }).start(() => {
                        setFilteredData((prev: Filtered) => ({ ...prev, is_best: false }));
                    });
                } else {
                    Animated.spring(height, {
                        toValue: Dimensions.get("window").height * 0.25,
                        useNativeDriver: false,
                    }).start(() => {
                        setFilteredData((prev: Filtered) => ({ ...prev, is_best: true }));
                    });
                }
            },
        })
    ).current;


    return (
        <Animated.View style={[styles.footer, { height }]} {...panResponder.panHandlers}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
                <View style={styles.dragZone} />
                {dataReel ? (
                    <ScrollView
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                        onStartShouldSetResponderCapture={() => false}
                    >

                        {dataReel.length > 0 ?
                            dataReel.map((station, index) => (
                                <StationItem
                                    key={index}
                                    station={station}
                                    onPress={() => {
                                        onStationClicked(station.geom.lat, station.geom.lon);
                                    }}
                                />
                            )) : (
                                <View style={styles.loaderContainer}>
                                    <ActivityIndicator size="large" color="#fff" />
                                    <Text style={styles.loaderText}>Chargement des stations...</Text>
                                </View>
                            )
                        }
                    </ScrollView>
                ): <Text> Loading ...</Text>}

            </BlurView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    footer: {
        padding: 10,
        marginHorizontal: 10,
        marginBottom: 10,
        bottom: 0,
        position: "absolute",
        left: 0,
        right: 0,
        borderRadius: 30,
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.7)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        // @ts-ignore
        backdropFilter: 'blur(10px)',
    },
    dragZone: {
        height: 10,
        borderRadius: 8,
        width: 50,
        alignSelf: "center",
        marginVertical: 12,
        backgroundColor: "#ccc",
        opacity: 0.6,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    loaderText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});
