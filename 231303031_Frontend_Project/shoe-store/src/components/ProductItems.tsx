import { Link } from 'react-router';
import type { Product } from '../store/slice/ProductListSlice';

export default function ProductItems({ product }: { product: Product }) {
    return (
        <>
            <div className="col-6 col-sm-6 col-lg-3">
                <div className="card h-100 shadow-sm">
                    <Link to={`/products/${product.id}`}>
                        <img
                            src={product.image}
                            className="card-img-top"
                            style={{ height: "220px", objectFit: "cover" }}
                            alt={product.name}
                        />
                    </Link>
                    <div className="card-body">
                        <span className="product-brand">{product.brand}</span>
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="product-rating">
                            Đánh giá {product.rating} | Đã bán {product.sold}
                        </p>
                        <p className="text-danger fw-bold">
                            {product.price.toLocaleString('vi-VN')} đ
                            {product.originalPrice > product.price && (
                                <span className="product-old-price">
                                    {product.originalPrice.toLocaleString('vi-VN')} đ
                                </span>
                            )}
                        </p>
                        <Link to={`/products/${product.id}`} className="btn btn-primary">
                            Xem sản phẩm
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
