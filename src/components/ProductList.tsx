import { useProducts } from '../hooks/useProducts';
import ProductItems from './ProductItems';
import '../styles/products.css';

export default function ProductList() {
    const { products, status, error, reload } = useProducts();

    if (status === 'loading') {
        return (
            <div className="product-list-status" role="status">
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="product-list-status" role="alert">
                <p className="product-error">{error}</p>
                <button type="button" className="btn" onClick={reload}>
                    Thử lại
                </button>
            </div>
        );
    }

    if (products.length === 0) return <p>Chưa có sản phẩm.</p>;

    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductItems key={product.id} product={product} />
            ))}
        </div>
    );
}
