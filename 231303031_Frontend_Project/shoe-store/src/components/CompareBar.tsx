import { Link, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { removeCompare } from '../store/slice/CompareSlice';
import '../styles/compare.css';

// Băng so sánh nằm ở cuối màn hình khi đã chọn sản phẩm
export default function CompareBar() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const selectedProducts = useSelector((state: RootState) => state.compare.selectedProducts);

    // Chưa chọn sản phẩm nào, hoặc đang ở trang so sánh thì không hiện
    if (selectedProducts.length === 0 || location.pathname === '/compare') {
        return null;
    }

    return (
        <div className="compare-bar">
            <div className="compare-bar-inner">
                <p className="compare-bar-title">Đã chọn {selectedProducts.length}/3 sản phẩm</p>

                <ul className="compare-bar-list">
                    {selectedProducts.map((product) => (
                        <li key={product.id} className="compare-bar-item">
                            <img src={product.image} alt={product.name} />
                            <span>{product.name}</span>
                            <button
                                type="button"
                                aria-label="Bỏ so sánh"
                                onClick={() => dispatch(removeCompare(product.id))}
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Cần ít nhất 2 sản phẩm mới so sánh được */}
                {selectedProducts.length < 2 ? (
                    <p className="compare-bar-note">Chọn thêm ít nhất 1 sản phẩm để so sánh</p>
                ) : (
                    <Link to="/compare" className="compare-button">So sánh ngay</Link>
                )}
            </div>
        </div>
    );
}