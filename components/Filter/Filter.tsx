import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useData } from "../../context/DataContext";
import getAllFuelTypeWithStationArray from "../../utils/getAllFuelTypeWithStationArray";
import {Filtered} from "../../types/Filtered";

export default function Filter() {
    const { data, setFilteredData,filteredData } = useData();
    const [allFuelTypes, setAllFuelTypes] = useState<string[]>([]);
    const [selectedFuelType, setSelectedFuelType] = useState<string>("");
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
