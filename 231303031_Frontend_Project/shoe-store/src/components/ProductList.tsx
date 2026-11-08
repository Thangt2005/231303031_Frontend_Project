import { useSelector } from 'react-redux';
import type { Product } from '../store/slice/ProductListSlice';
import ProductItems from './ProductItems';
import '../styles/products.css';

export default function ProductList() {
    const products = useSelector((state: { products: Product[] }) => state.products);

    if (products.length === 0) return <p>Chưa có sản phẩm.</p>;

    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductItems key={product.id} product={product} />
            ))}
        </div>
    );
}
