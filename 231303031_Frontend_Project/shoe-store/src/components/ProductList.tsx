import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductItems from './ProductItems';
import { fetchProducts } from '../store/slice/ProductListSlice';
import type { AppDispatch, RootState } from '../store/store';
import '../styles/products.css';

export default function ProductList() {
    const { products, loading, error } = useSelector(
        (state: RootState) => state.products
    );

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="product-state" aria-busy="true">
                <p className="product-loading">Đang tải sản phẩm...</p>

                <div className="product-skeleton-grid">
                    {[0, 1, 2, 3].map((item) => (
                        <div key={item} className="product-skeleton-card">
                            <div className="product-skeleton-media" />
                            <div className="product-skeleton-line" />
                            <div className="product-skeleton-line product-skeleton-line--short" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-state product-state--error" role="alert">
                <p className="product-error">{error}</p>

                <button
                    type="button"
                    className="product-retry"
                    onClick={() => dispatch(fetchProducts())}
                >
                    Thử lại
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return <p className="product-empty">Chưa có sản phẩm.</p>;
    }

    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductItems key={product.id} product={product} />
            ))}
        </div>
    );
}