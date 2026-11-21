import type { Product } from '../store/slice/ProductListSlice';
import ProductItem from './ProductItems';
import '../styles/products.css';

// Nhận danh sách đã được lọc từ ProductsPage và chỉ render lưới sản phẩm.
export default function ProductList({ products }: { products: Product[] }) {
    if (!Array.isArray(products) || products.length === 0) {
        return <p>Không có sản phẩm</p>;
    }

    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductItem key={product.id} product={product} />
            ))}
        </div>
    );
}
