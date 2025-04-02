import { View, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useData } from "../../context/DataContext";
import getAllFuelTypeWithStationArray from "../../utils/getAllFuelTypeWithStationArray";
import {Filtered} from "../../types/Filtered";
import Slider from "@react-native-community/slider";
import getFuelTypeMinMaxWithStations from "../../utils/getFuelInfo";

export default function Filter() {
    const { data, setFilteredData,filteredData } = useData();
    const [allFuelTypes, setAllFuelTypes] = useState<string[]>([]);
    const [selectedFuelType, setSelectedFuelType] = useState<string>("");
    const fuelInfo = getFuelTypeMinMaxWithStations({
        stations: data
    })
    const [value, setValue] = useState(0.4);

    useEffect(() => {
        const fuelTypes = getAllFuelTypeWithStationArray({ stations: data });
        if (fuelTypes.length > 0) {
            setAllFuelTypes(fuelTypes);
            setSelectedFuelType(filteredData.fuelType);
        }
    }, [data]);

    useEffect(() => {
        if (selectedFuelType)  setFilteredData((prev: Filtered) => ({ ...prev, fuelType: selectedFuelType }));
    }, [selectedFuelType]);

    useEffect(() => {
        setFilteredData((prev: Filtered) => ({ ...prev, max_price: value }));
    }, [value]);

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={selectedFuelType}
                onValueChange={(itemValue) => setSelectedFuelType(itemValue)}
                mode="dropdown"
            >
                {allFuelTypes.map((fuelType, index) => (
                    <Picker.Item key={index} label={fuelType} value={fuelType} />
                ))}
            </Picker>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 100,
        backgroundColor: "#fff",
    },
});
