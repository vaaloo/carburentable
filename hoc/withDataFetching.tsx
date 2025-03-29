import React, { useEffect, useState, ComponentType } from "react";
import Station from "../types/Station";

export function dataHook(sql: string) {
    const [data, setData] = useState<Station[] | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const encodedUri = encodeURI(`https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?` + sql);
        fetch(encodedUri)
            .then((r) => {
                if (!r.ok) throw new Error(r.statusText);
                return r.json();
            })
            .then((data: any) => setData(data.results))
            .catch(e => setError(e))
    }, [sql]);

    return { data, error,  };
}

interface WithLoaderProps {
    data: any;
}

export default function withDataFetching<P extends WithLoaderProps>(
    Element: ComponentType<P>,
    sql: string
) {
    return (props: Omit<P, "data">) => {
        const { data } = dataHook(sql);


        return <Element {...(props as P)} data={data} />;
    };
}
