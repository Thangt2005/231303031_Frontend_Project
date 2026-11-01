import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../services/productService';
import { load } from '../store/slice/ProductListSlice';
import type { Product } from '../store/slice/ProductListSlice';
import ProductItems from './ProductItems';
import '../styles/products.css';

export default function ProductList() {
    const products = useSelector((state: { products: Product[] }) => state.products);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getProducts();
                dispatch(load(data));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Không tải được sản phẩm.');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [dispatch]);

    if (loading) return <p>Đang tải sản phẩm...</p>;
    if (error) return <p className="product-error">{error}</p>;
    if (products.length === 0) return <p>Chưa có sản phẩm.</p>;

    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductItems key={product.id} product={product} />
            ))}
        </div>
    );
}
