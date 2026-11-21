import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import ProductFilter, {
    filterAndSortProducts,
    getBrands,
} from '../components/ProductFilter';
import ProductList from '../components/ProductList';
import ProductSkeleton from '../components/ProductSkeleton';
import Pagination from '../components/Pagination';
import { getProducts } from '../services/productService';
import type { Product } from '../store/slice/ProductListSlice';
import '../styles/products.css';

const PAGE_SIZE = 8;

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
    const brandParam = searchParams.get('brand') ?? '';

    const [brand, setBrand] = useState(brandParam);
    const [price, setPrice] = useState('');
    const [sort, setSort] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

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

    // Đồng bộ khi bấm link hãng trên Header: /products?brand=Nike
    useEffect(() => {
        setBrand(brandParam);
    }, [brandParam]);

    // Đổi tìm kiếm/lọc/sắp xếp thì quay về trang đầu.
    useEffect(() => {
        setCurrentPage(1);
    }, [keyword, brand, price, sort]);

    const brands = useMemo(() => getBrands(products), [products]);

    const searchedProducts = useMemo(() => {
        const normalizedKeyword = normalize(keyword);
        return normalizedKeyword
            ? products.filter((product) =>
                  normalize(product.name ?? '').includes(normalizedKeyword)
              )
            : products;
    }, [products, keyword]);

    const visibleProducts = useMemo(
        () => filterAndSortProducts(searchedProducts, { brand, price, sort }),
        [searchedProducts, brand, price, sort]
    );

    const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedProducts = visibleProducts.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    const handleReset = () => {
        setBrand('');
        setPrice('');
        setSort('');

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('brand');
        setSearchParams(nextParams);
    };

    if (loading) {
        return (
            <div className="container">
                <h2 className="text-center mb-4">Danh sách sản phẩm</h2>
                <ProductSkeleton count={PAGE_SIZE} />
            </div>
        );
    }

    if (error) {
        return <p className="product-error">{error}</p>;
    }

    return (
        <>
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

                <ProductFilter
                    brand={brand}
                    price={price}
                    sort={sort}
                    brands={brands}
                    onBrandChange={setBrand}
                    onPriceChange={setPrice}
                    onSortChange={setSort}
                    onReset={handleReset}
                />

                {visibleProducts.length === 0 ? (
                    <div className="product-search-empty">
                        <p>
                            {keyword
                                ? `Không tìm thấy sản phẩm nào có tên chứa "${keyword}".`
                                : 'Không có sản phẩm phù hợp với bộ lọc.'}
                        </p>
                        <Link to="/products">Xem tất cả sản phẩm</Link>
                    </div>
                ) : (
                    <>
                        <ProductList products={paginatedProducts} />
                        <Pagination
                            currentPage={safePage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </>
    );
}
