import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { Product } from '../store/slice/ProductListSlice';
import type { RootState, AppDispatch } from '../store/store';
import { addCompare, removeCompare } from '../store/slice/CompareSlice';

export default function ProductItems({ product }: { product: Product }) {
    const dispatch = useDispatch<AppDispatch>();
    const selectedProducts = useSelector((state: RootState) => state.compare.selectedProducts);

    // Kiểm tra sản phẩm này đã được chọn để so sánh chưa
    const found = selectedProducts.find((item) => item.id === product.id);
    const isSelected = found !== undefined;

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

    return(
        <>
            <div className="col-6 col-sm-6 col-lg-3">
                <div className="card h-100 shadow-sm">
                    <img
                        src={product.image}
                        className="card-img-top"
                        style={{ height: "220px", objectFit: "cover" }}
                        alt={product.name}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="text-danger fw-bold">{product.price.toLocaleString('vi-VN')} đ</p>
                        <Link to={`/products/${product.id}`} className="btn btn-primary">Xem sản phẩm</Link>
                        <button type="button" className="btn btn-secondary" onClick={handleCompare}>
                            {isSelected ? 'Bỏ so sánh' : 'So sánh'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}