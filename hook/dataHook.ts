import { useEffect, useState } from "react";



export function dataHook(cp: string) {
    const [data, setData] = useState<string[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        const encodedUri = encodeURI(`https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?select=*&where=cp like "${cp}"&limit=-1`)
        setIsLoading(true);
        fetch(encodedUri)
            .then((r) => {
                if (!r.ok) throw new Error(r.statusText);
                return r.json()
            })
            .then((data: any) => {
                console.log(data)
                setData(data);
            })
            .catch(e => setError(e))
            .finally(() => setIsLoading(false));
    }, [cp]);

    return { data, error, isLoading };
}