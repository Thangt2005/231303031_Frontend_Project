import type { Product } from '../store/slice/ProductListSlice';

export type ProductFilterValues = {
    brand: string;
    price: string;
    sort: string;
};

const priceOptions = [
    { value: '', label: 'Tất cả mức giá' },
    { value: 'under1', label: 'Dưới 1.000.000đ' },
    { value: '1to3', label: '1.000.000đ - 3.000.000đ' },
    { value: 'over3', label: 'Trên 3.000.000đ' },
];

const sortOptions = [
    { value: '', label: 'Mặc định' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'price-desc', label: 'Giá giảm dần' },
    { value: 'name-asc', label: 'Tên A - Z' },
    { value: 'name-desc', label: 'Tên Z - A' },
];

// Lấy danh sách hãng có trong dữ liệu để đổ vào select.
export function getBrands(products: Product[]) {
    return Array.from(new Set(products.map((product) => product.brand).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, 'vi'));
}

// Lọc theo hãng, khoảng giá rồi sắp xếp theo lựa chọn.
export function filterAndSortProducts(
    products: Product[],
    values: ProductFilterValues
) {
    const result = products.filter((product) => {
        const price = Number(product.price) || 0;

        if (values.brand && product.brand !== values.brand) {
            return false;
        }

        if (values.price === 'under1' && price >= 1000000) {
            return false;
        }

        if (values.price === '1to3' && (price < 1000000 || price > 3000000)) {
            return false;
        }

        if (values.price === 'over3' && price <= 3000000) {
            return false;
        }

        return true;
    });

    if (values.sort === 'price-asc') {
        result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (values.sort === 'price-desc') {
        result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (values.sort === 'name-asc') {
        result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    } else if (values.sort === 'name-desc') {
        result.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
    }

    return result;
}

type ProductFilterProps = ProductFilterValues & {
    brands: string[];
    onBrandChange: (value: string) => void;
    onPriceChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onReset: () => void;
};

export default function ProductFilter({
    brand,
    price,
    sort,
    brands,
    onBrandChange,
    onPriceChange,
    onSortChange,
    onReset,
}: ProductFilterProps) {
    return (
        <div className="product-filter">
            <div className="product-filter-item">
                <label htmlFor="filter-brand">Hãng</label>
                <select
                    id="filter-brand"
                    className="product-filter-select"
                    value={brand}
                    onChange={(event) => onBrandChange(event.target.value)}
                >
                    <option value="">Tất cả hãng</option>
                    {brands.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <div className="product-filter-item">
                <label htmlFor="filter-price">Khoảng giá</label>
                <select
                    id="filter-price"
                    className="product-filter-select"
                    value={price}
                    onChange={(event) => onPriceChange(event.target.value)}
                >
                    {priceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="product-filter-item">
                <label htmlFor="filter-sort">Sắp xếp</label>
                <select
                    id="filter-sort"
                    className="product-filter-select"
                    value={sort}
                    onChange={(event) => onSortChange(event.target.value)}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <button type="button" className="product-filter-reset" onClick={onReset}>
                Xóa bộ lọc
            </button>
        </div>
    );
}
