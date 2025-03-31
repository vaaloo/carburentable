import React from "react";
import { Marker } from "react-native-maps";
import Station from "../../types/Station";
import { useData } from "../../context/DataContext";

export default function DataMarkers() {
    const { data } = useData();

    if (!data) return null;

    return (
        <>
            {data.map((item: Station) => (
                <Marker
                    key={item.id || `${item.geom.lat}-${item.geom.lon}`}
                    coordinate={{
                        latitude: item.geom.lat,
                        longitude: item.geom.lon,
                    }}
                    title={item.adresse}
                />
            ))}
        </>
    );
}
