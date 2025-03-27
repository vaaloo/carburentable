import { useEffect, useState } from "react";

export function dataHook(sql: string) {
    const [data, setData] = useState<Station[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        const encodedUri = encodeURI(`https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?` + sql)
        setIsLoading(true);
        fetch(encodedUri)
            .then((r) => {
                if (!r.ok) throw new Error(r.statusText);
                return r.json()
            })
            .then((data: any) => {
                setData(data.results);
            })
            .catch(e => setError(e))
            .finally(() => setIsLoading(false));
    }, [sql]);

    return { data, error, isLoading };
}