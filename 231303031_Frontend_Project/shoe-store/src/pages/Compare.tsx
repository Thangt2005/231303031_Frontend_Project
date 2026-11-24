import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { removeCompare } from '../store/slice/CompareSlice';
import '../styles/compare.css';

// Đổi số tiền sang dạng 2.390.000 đ
function formatPrice(price: number) {
    return price.toLocaleString('vi-VN') + ' đ';
}

// Nối danh sách size, màu thành chuỗi; không có thì ghi "Không có"
function showList(list?: (string | number)[]) {
    if (list && list.length > 0) {
        return list.join(', ');
    }

    return 'Không có';
}

export default function Compare() {
    const dispatch = useDispatch<AppDispatch>();
    const selectedProducts = useSelector((state: RootState) => state.compare.selectedProducts);

    // Chưa chọn sản phẩm nào
    if (selectedProducts.length === 0) {
        return (
            <section className="compare-page">
                <h1>So sánh sản phẩm</h1>
                <p>Chưa có sản phẩm nào để so sánh.</p>
                <Link to="/products" className="compare-button">Chọn sản phẩm</Link>
            </section>
        );
    }

    return (
        <section className="compare-page">
            <h1>So sánh sản phẩm</h1>

            {selectedProducts.length < 2 && (
                <p className="compare-note">Chọn thêm sản phẩm để so sánh (tối đa 3).</p>
            )}

            {/* Bảng rộng thì cuộn ngang trong khung, không làm vỡ trang */}
            <div className="compare-table-wrapper">
                <table className="compare-table">
                    <tbody>
                        <tr>
                            <th>Sản phẩm</th>
                            {selectedProducts.map((product) => (
                                <td key={product.id}>
                                    <img src={product.image} alt={product.name} className="compare-image" />
                                    <Link to={`/products/${product.id}`} className="compare-name">
                                        {product.name}
                                    </Link>
                                    <button
                                        type="button"
                                        className="compare-remove"
                                        onClick={() => dispatch(removeCompare(product.id))}
                                    >
                                        Bỏ so sánh
                                    </button>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <th>Giá</th>
                            {selectedProducts.map((product) => (
                                <td key={product.id} className="compare-price">{formatPrice(product.price)}</td>
                            ))}
                        </tr>
                        <tr>
                            <th>Giá gốc</th>
                            {selectedProducts.map((product) => (
                                <td key={product.id}>{formatPrice(product.originalPrice)}</td>
                            ))}
                        </tr>
                        <tr>
                            <th>Thương hiệu</th>
                            {selectedProducts.map((product) => (
                                <td key={product.id}>{product.brand}</td>
                            ))}
                        </tr>
                        <tr>
                            <th>Loại</th>
                            {selectedProducts.map((product) => (
                                <td key={product.id}>{product.category}</td>
                            ))}
                        </tr>
                        <tr>
                            <th>Giới tính</th>
                            {selectedProducts.map((product) => (
                                <td key={product.id}>{product.gender}</td>
                            ))}
                        </tr>
                        <tr>
                            <th>Size</th>
                            {selectedProducts.map((product) => (
                                <td key={product.id}>{showList(product.sizes)}</td>
                            ))}
                        </tr>
                        <tr>
                            <th>Màu</th>
                            {selectedProducts.map((product) => (
                                <td key={product.id}>{showList(product.colors)}</td>
                            ))}
                        </tr>
                        <tr>
                            <th>Đánh giá</th>
                            {selectedProducts.map((product) => (
                                <td key={product.id}>{product.rating}/5</td>
                            ))}
                        </tr>
                        <tr>
                            <th>Đã bán</th>
                            {selectedProducts.map((product) => (
                                <td key={product.id}>{product.sold}</td>
                            ))}
                        </tr>
                        <tr>
                            <th>Còn lại</th>
                            {selectedProducts.map((product) => (
                                <td key={product.id}>{product.stock}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            <Link to="/products" className="compare-back">← Tiếp tục chọn sản phẩm</Link>
        </section>
    );
}