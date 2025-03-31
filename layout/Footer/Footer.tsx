import React from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import StationItem from "../../components/StationItem/StationItem";
import {useData} from "../../context/DataContext";

export default function Footer({ onStationClicked }: { onStationClicked: (lat: number, lon: number) => void }) {
    const { data } = useData();



    if (!data) {
        return null;
    }

    return (
        <BlurView intensity={30} tint="dark" style={styles.footer}>
            <Animated.ScrollView>
                {data.map((station, index) => (
                    <StationItem key={index} station={station} onPress={() => onStationClicked(station.geom.lat, station.geom.lon)} />
                ))}
            </Animated.ScrollView>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    footer: {
        padding: 10,
        bottom: 0,
        position: "absolute",
        width: Dimensions.get("window").width,
        height: "25%",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.7)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        borderWidth: 0,
    }
});
