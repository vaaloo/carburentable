import { Dimensions, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur"; // Importer BlurView
import StationItem from "../../components/StationItem/StationItem";
import withDataFetching from "../../hoc/withDataFetching";
import Station from "../../types/Station";

function Footer({data}: {data: Station[]}) {
    if (!data) {
        return null;
    }

    return (
        <BlurView intensity={50} tint="dark" style={styles.footer}>
            {data.map((station, index) => (
                <StationItem key={index} station={station} />
            ))}
        </BlurView>
    );
}

const styles = StyleSheet.create({
    footer: {
        padding: 10,
        bottom: 20,
        left: 20,
        color:"white",
        borderColor: "white",
        borderWidth: 1,
        position: "absolute",
        width: Dimensions.get("window").width - 40,
        height: "30%",
        borderRadius: 8,
        overflow: "hidden",
    },
});

export default withDataFetching(Footer, 'select=*&where=cp=13100')