import { useState, useEffect } from 'react';
import axios from 'axios';

// Hook tải dữ liệu bằng axios. Dùng: const { data, loading, error } = useAPIV1(url);
export default function useAPIV1<T = any>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        setError(null);

        axios.get<T>(url, { signal: controller.signal })
            .then((response) => {
                if (!controller.signal.aborted) setData(response.data);
            })
            .catch((err) => {
                if (controller.signal.aborted || axios.isCancel(err)) return;
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
