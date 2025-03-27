import {Dimensions, StyleSheet, View} from "react-native";
import StationItem from "../../components/StationItem/StationItem";

export default function Footer() {
    return (
        <View style={styles.footer}>
            <StationItem/>

        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        bottom: 5,
        position: 'absolute',
        width: Dimensions.get("window").width - 10,
        height: '30%',
        flex: 1,
        backgroundColor: 'red',
        borderRadius: 8,
    },
});
