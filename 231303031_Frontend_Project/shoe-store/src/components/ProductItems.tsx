import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { Product } from '../store/slice/ProductListSlice';
import type { RootState, AppDispatch } from '../store/store';
import { addCompare, removeCompare } from '../store/slice/CompareSlice';
import { addWishlist, removeWishlist } from '../store/slice/WishlistSlice';
import '../styles/wishlist.css';

export default function ProductItems({ product }: { product: Product }) {
    const dispatch = useDispatch<AppDispatch>();
    const selectedProducts = useSelector((state: RootState) => state.compare.selectedProducts);
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

    // Kiểm tra sản phẩm này đã được chọn để so sánh chưa
    const found = selectedProducts.find((item) => item.id === product.id);
    const isSelected = found !== undefined;

    // Kiểm tra sản phẩm này đã có trong danh sách yêu thích chưa
    const isSaved = wishlistItems.some((item) => item.id === product.id);

    // Bấm nút: chưa chọn thì thêm, đã chọn thì bỏ
    function handleCompare() {
        if (isSelected) {
            dispatch(removeCompare(product.id));
        } else if (selectedProducts.length >= 3) {
            alert('Chỉ được chọn tối đa 3 sản phẩm để so sánh.');
        } else {
            dispatch(addCompare(product));
        }
    }

    // Bấm nút tim: đã lưu thì bỏ, chưa lưu thì thêm vào wishlist
    function handleWishlist() {
        if (isSaved) {
            dispatch(removeWishlist(product.id));
        } else {
            dispatch(addWishlist(product));
        }
    }

    return(
        <>
            <div className="col-6 col-sm-6 col-lg-3">
                <div className="card h-100 shadow-sm">
                    <img
                        src={product.image}
                        className="card-img-top"
                        alt={product.name}
                    />
                    <div className="card-body">
                        <h5 className="card-title">
                            <Link to={`/products/${product.id}`} className="card-link">
                                {product.name}
                            </Link>
                        </h5>
                        <p className="card-text">{product.description}</p>
                        <p className="text-danger fw-bold">{product.price.toLocaleString('vi-VN')} đ</p>
                        <div className="card-actions">
                            <button type="button" className="btn btn-secondary" onClick={handleCompare}>
                                {isSelected ? 'Bỏ so sánh' : 'So sánh'}
                            </button>
                            <button
                                type="button"
                                className={`wishlist-toggle${isSaved ? ' is-active' : ''}`}
                                onClick={handleWishlist}
                                aria-pressed={isSaved}
                            >
                                <svg
                                    className="wishlist-heart"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill={isSaved ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                <span>{isSaved ? 'Đã lưu' : 'Yêu thích'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}