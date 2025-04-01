import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Filter from "../../components/Filter/Filter";

export default function Header({
  onRecenter, onRangeChange
}: {
  onRecenter: () => void;
  onRangeChange: (value: number) => void;
}) {
    const [range, setRange] = useState(1);

    const handleValueChange = (value: number) => {
        setRange(value);
        onRangeChange(value);
    };

    return (
        <View style={styles.header}>
            <View style={styles.leftButtons}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="filter" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={onRecenter}>
                    <Ionicons name="locate" size={24} color="#fff" />
                </TouchableOpacity>
                <Filter/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftButtons: {
        flexDirection: 'column',
        gap: 12,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderContainer: {
        width: 60,
        height: 150,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    slider: {
        width: 120,
        height: 40,
        transform: [{ rotate: '-90deg' }],
    },
});