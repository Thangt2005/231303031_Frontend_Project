import { useState, useEffect } from 'react';

// Hook tải dữ liệu bằng fetch. Dùng: const { data, loading, error } = useAPI(url);
export default function useAPI<T = any>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        setError(null);

        fetch(url, { signal: controller.signal })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error('Lỗi khi gọi API (HTTP ' + res.status + ')');
                }
                return res.json();
            })
            .then((json: T) => {
                if (!controller.signal.aborted) setData(json);
            })
            .catch((err) => {
                if (controller.signal.aborted) return;
                setData(null);
                setError(err.message || 'Lỗi khi gọi API');
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [url]);

    return { data, error, loading };
}
