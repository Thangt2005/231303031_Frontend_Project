import { Link } from 'react-router';
import type { Product } from '../store/slice/ProductListSlice';

export default function ProductItems({ product }: { product: Product }) {
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
                    </div>
                </div>
            </div>
        </>
    )
}