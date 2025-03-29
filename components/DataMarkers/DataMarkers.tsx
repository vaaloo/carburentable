import { Marker } from "react-native-maps";
import Station from "../../types/Station";
import withDataFetching from "../../hoc/withDataFetching";

function DataMarkers({data}: {data: Station[]}) {
    if (!data) return null;

    return (
        <>
            {data.map((item: Station) => {
                if (!item.geom || !item.geom.lat || !item.geom.lon) {
                    return null;
                }

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

export default withDataFetching(DataMarkers, "select=*&where=cp=13100");