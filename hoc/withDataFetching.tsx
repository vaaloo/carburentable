import React, { useEffect, useState, ComponentType } from "react";

interface WithLoaderProps {
    data: any;
}

export default function withDataFetching<P extends WithLoaderProps>(
    Element: ComponentType<P>,
    url: string
) {
    return (props: Omit<P, "data">) => {
        const [data, setData] = useState<P["data"] | null>(null);

        useEffect(() => {
            fetch(url).then(res => res.json()).then(data => setData(data));
        }, [url]);

        if (!data) {
            return <div>Loading...</div>;
        }

        return <Element {...(props as P)} data={data} />;
    };
}
