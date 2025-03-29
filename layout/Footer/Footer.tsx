import React from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import StationItem from "../../components/StationItem/StationItem";
import withDataFetching from "../../hoc/withDataFetching";
import Station from "../../types/Station";

function Footer({ data, onStationClicked }: { data: Station[]; onStationClicked: (lat: number, lon: number) => void }) {
    if (!data) {
        return null;
    }

    return (
        <BlurView intensity={30} tint="dark" style={styles.footer}>
            <Animated.ScrollView>
                {data.map((station, index) => (
                    <StationItem key={index} station={station} onPress={() => onStationClicked(station.geom.lat, station.geom.lon)}/>
                ))}
            </Animated.ScrollView>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    footer: {
        padding: 10,
        bottom: 20,
        left: 20,
        position: "absolute",
        width: Dimensions.get("window").width - 40,
        height: "30%",
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

export default withDataFetching(Footer, 'select=*&where=cp=13120');
