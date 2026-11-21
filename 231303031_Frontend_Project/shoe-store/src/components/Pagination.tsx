import '../styles/products.css';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = [];
    for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
    }

    return (
        <nav className="product-pagination" aria-label="Phân trang sản phẩm">
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Trước
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    className={page === currentPage ? 'is-active' : ''}
                    onClick={() => onPageChange(page)}
                    aria-current={page === currentPage ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Sau
            </button>

            <span className="product-pagination-info">
                Trang {currentPage} / {totalPages}
            </span>
        </nav>
    );
}
