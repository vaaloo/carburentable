import React, { useState, useRef, useEffect } from 'react';
import { Animated, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Filter from "../../components/Filter/Filter";

export default function Header({
  onRecenter
}: {
  onRecenter: () => void;
}) {
    const [filterVisible, setFilterVisible] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(opacity, {
        toValue: filterVisible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, [filterVisible]);

    return (
        <View style={styles.header}>
            <View style={styles.leftButtons}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setFilterVisible(!filterVisible)}>
                    <Ionicons name={filterVisible ? "close" : "filter"} size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={onRecenter}>
                    <Ionicons name="locate" size={24} color="#fff" />
                </TouchableOpacity>
                <Animated.View style={{ opacity }}>
                  {filterVisible && <Filter />}
                </Animated.View>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        gap: 12,
        padding: 12,
        borderRadius: 20,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});