import React, { useEffect, useState } from "react";
import { Marker } from "react-native-maps";
import Station from "../../types/Station";
import { useData } from "../../context/DataContext";

export default function DataMarkers() {
    const { data } = useData();

    console.log("Data length:", data.length);


    return (
        <>
            {data.map((item: Station) => {
                console.log('id',item.id)
                return (
                    <Marker
                        key={item.id || `${item.geom.lat}-${item.geom.lon}`}
                        coordinate={{
                            latitude: item.geom.lat,
                            longitude: item.geom.lon,
                        }}
                        title={item.adresse}
                    />)
            })}
        </>
    );
}
