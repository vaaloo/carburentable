import React, { useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet, ScrollView, View } from "react-native";
import { BlurView } from "expo-blur";
import StationItem from "../../components/StationItem/StationItem";
import { useData } from "../../context/DataContext";
import { Filtered } from "../../types/Filtered";

export default function Footer({ onStationClicked }: { onStationClicked: (lat: number, lon: number) => void }) {
    const { data, setFilteredData } = useData();
    const dataReel = data.filter((item) => item.opacity === 1);
    const [height] = useState(new Animated.Value(Dimensions.get("window").height * 0.25));
    const touchStartY = useRef(0);

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
                    Math.min(Dimensions.get("window").height * 0.5, height._value - gestureState.dy)
                );
                height.setValue(newHeight);
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy < -50) {
                    Animated.spring(height, {
                        toValue: Dimensions.get("window").height * 0.5,
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

    if (!data) return null;

    return (
        <Animated.View style={[styles.footer, { height }]} {...panResponder.panHandlers}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
                <View style={styles.dragZone} />
                <ScrollView
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    onStartShouldSetResponderCapture={() => false}
                >
                    {dataReel.map((station, index) => (
                        <StationItem key={index} station={station} onPress={() => onStationClicked(station.geom.lat, station.geom.lon)} />
                    ))}
                </ScrollView>
            </BlurView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    footer: {
        padding: 10,
        bottom: 0,
        position: "absolute",
        width: Dimensions.get("window").width,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.7)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    dragZone: {
        height: 40, // Zone où le PanResponder peut s'activer
        backgroundColor: "transparent",
    },
});
