import {Dimensions, StyleSheet, View} from "react-native";
import StationItem from "../../components/StationItem/StationItem";
import {dataHook} from "../../hook/dataHook";

export default function Footer() {
    const { data } = dataHook("select=*&where=code_departement=13");
    if (!data) {
        return null
    }
    return (
        <View style={styles.footer}>
            {data.map((station, index) => (
                <StationItem station={station} />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        bottom: 5,
        overflow: "scroll",
        position: 'absolute',
        width: Dimensions.get("window").width - 10,
        height: '30%',
        flex: 1,
        backgroundColor: 'red',
        borderRadius: 8,
    },
});
