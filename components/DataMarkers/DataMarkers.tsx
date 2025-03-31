import { Marker } from "react-native-maps";
import Station from "../../types/Station";
import {useData} from "../../context/DataContext";

export default function DataMarkers() {
    const {data} = useData();
    if (!data) return null;

    return (
        <>
            {data.map((item: Station) => {

                return (
                    <Marker
                        key={item.id || Math.random()}
                        coordinate={{
                            latitude: item.geom.lat,
                            longitude: item.geom.lon,
                        }}
                        title={item.adresse}
                    />
                );
            })}
        </>
    );
}
