import '../styles/products.css';

// Khung xương giống thẻ ProductItems để hiện trong lúc chờ tải dữ liệu.
export default function ProductSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div
            className="product-list product-skeleton-list"
            aria-busy="true"
            aria-label="Đang tải sản phẩm"
        >
            {Array.from({ length: count }, (_, index) => (
                <div className="col-6 col-sm-6 col-lg-3" key={index}>
                    <div className="card h-100 shadow-sm product-skeleton-card">
                        <div className="product-skeleton-image skeleton-block" />

                        <div className="card-body">
                            <div className="product-skeleton-line skeleton-block" />
                            <div className="product-skeleton-line skeleton-block product-skeleton-line--short" />
                            <div className="product-skeleton-line skeleton-block product-skeleton-line--price" />
                            <div className="product-skeleton-button skeleton-block" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
