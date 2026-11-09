import { useSelector } from "react-redux";
import ProductItem from "./ProductItems";
import "../styles/products.css";

export default function ProductList() {
    const products = useSelector((state: any) => state.products || []);

    if (!Array.isArray(products) || products.length === 0) {
        return <p className="product-loading">Đang tải sản phẩm...</p>;
    }

    return (
        <div className="product-list">
            {products.map((product: any) => (
                <ProductItem key={product.id} product={product} />
            ))}
        </div>
    );
}
