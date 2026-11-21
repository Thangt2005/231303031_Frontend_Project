import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import ProductList from '../components/ProductList';
import { getProducts } from '../services/productService';
import type { Product } from '../store/slice/ProductListSlice';
import '../styles/products.css';

// Bỏ dấu, bỏ phân biệt hoa/thường để "chay bo" vẫn khớp "Giày chạy bộ".
function normalize(value: string) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .toLowerCase()
        .trim();
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const keyword = (searchParams.get('search') ?? '').trim();

    useEffect(() => {
        let ignore = false;

        async function loadProducts() {
            try {
                const data: Product[] = await getProducts();
                if (!ignore) {
                    setProducts(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (!ignore) {
                    setError('Không tải được danh sách sản phẩm.');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            ignore = true;
        };
    }, []);

    const normalizedKeyword = normalize(keyword);
    const visibleProducts = normalizedKeyword
        ? products.filter((product) =>
              normalize(product.name ?? '').includes(normalizedKeyword)
          )
        : products;

    if (loading) {
        return <p className="product-loading">Đang tải sản phẩm...</p>;
    }

    if (error) {
        return <p className="product-error">{error}</p>;
    }

    return (
        <>
            <nav className="navbar navbar-dark bg-primary mb-4">
                <div className="container">
                    <a className="navbar-brand fw-bold" href="#">
                        Cửa hàng của tôi
                    </a>
                </div>
            </nav>

            <div className="container">
                <h2 className="text-center mb-4">Danh sách sản phẩm</h2>

                {keyword && (
                    <div className="product-search-info">
                        <span>
                            {visibleProducts.length} kết quả cho từ khóa{' '}
                            <strong>"{keyword}"</strong>
                        </span>
                        <button
                            type="button"
                            className="product-search-clear"
                            onClick={() => setSearchParams({})}
                        >
                            Xóa tìm kiếm
                        </button>
                    </div>
                )}

                {visibleProducts.length === 0 ? (
                    <div className="product-search-empty">
                        <p>Không tìm thấy sản phẩm nào có tên chứa "{keyword}".</p>
                        <Link to="/products">Xem tất cả sản phẩm</Link>
                    </div>
                ) : (
                    <ProductList products={visibleProducts} />
                )}
            </div>
        </>
    );
}
