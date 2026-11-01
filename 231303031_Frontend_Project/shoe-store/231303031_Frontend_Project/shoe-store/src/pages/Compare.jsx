import { translate } from '../utils/translations';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, removeProduct } from '../store/slice/CompareSlice';
import { getProducts } from '../services/productService';
import '../styles/compare.css';

export default function Compare() {
  const language = useSelector((state) => state.language);
  const t = (text) => translate(text, language);
  const selectedProducts = useSelector((state) => state.compare);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      try {
        const data = await getProducts();
        if (!Array.isArray(data))
          throw new Error('Dữ liệu sản phẩm không hợp lệ.');
        if (active) setProducts(data);
      } catch (error) {
        if (active) setError(error.message || 'Không tải được sản phẩm.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  function handleAdd(event) {
    event.preventDefault();
    const product = products.find((item) => String(item.id) === selectedId);
    if (!product) {
      setMessage('Hãy chọn sản phẩm trước khi thêm.');
      return;
    }
    if (selectedProducts.some((item) => item.id === product.id)) {
      setMessage('Sản phẩm này đã có trong bảng so sánh.');
      return;
    }
    if (selectedProducts.length >= 3) {
      setMessage(
        'Chỉ được so sánh tối đa 3 sản phẩm. Hãy xóa một sản phẩm trước.',
      );
      return;
    }
    dispatch(addProduct(product));
    setSelectedId('');
    setMessage('Đã thêm sản phẩm vào bảng so sánh.');
  }

  function handleRemove(product) {
    dispatch(removeProduct(product.id));
    setMessage('Đã xóa sản phẩm khỏi bảng so sánh.');
  }

  const rows = [
    {
      label: 'Giá',
      value: (product) =>
        typeof product.price === 'number'
          ? product.price.toLocaleString('vi-VN') + ' đ'
          : 'Chưa có thông tin',
    },
    {
      label: 'Thương hiệu',
      value: (product) => product.brand || 'Chưa có thông tin',
    },
    {
      label: 'Loại giày',
      value: (product) => product.category || 'Chưa có thông tin',
    },
    {
      label: 'Màu sắc',
      value: (product) => product.colors?.join(', ') || 'Chưa có thông tin',
    },
    {
      label: 'Kích cỡ',
      value: (product) => product.sizes?.join(', ') || 'Chưa có thông tin',
    },
    {
      label: 'Mô tả',
      value: (product) => product.description || 'Chưa có thông tin',
    },
  ];

  return (
    <section className="compare-page">
      <p className="compare-eyebrow">{t("TÌM ĐÔI GIÀY PHÙ HỢP")}</p>
      <h1>{t("So sánh sản phẩm")}</h1>
      <p>{t("Chọn tối đa 3 sản phẩm để xem các thông tin cạnh nhau.")}</p>
      {loading ? (
        <p role="status">{t("Đang tải sản phẩm...")}</p>
      ) : error ? (
        <p role="alert">{t(error)}</p>
      ) : products.length === 0 ? (
        <p>{t("Chưa có sản phẩm để chọn.")}</p>
      ) : (
        <form className="compare-picker" onSubmit={handleAdd}>
          <label htmlFor="compare-product">{t("Chọn sản phẩm")}</label>
          <select
            id="compare-product"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            <option value="">{t("-- Chọn một đôi giày --")}</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <button type="submit">{t("Thêm để so sánh")}</button>
        </form>
      )}
      <p role="status" className="compare-message">
        {message ? t(message) : (language === 'en' ? `Selected ${selectedProducts.length}/3 products.` : `Đã chọn ${selectedProducts.length}/3 sản phẩm.`)}
      </p>
      {selectedProducts.length === 0 ? (
        <div className="compare-empty">{t("Bảng so sánh đang trống. Chọn sản phẩm ở phía trên để bắt đầu.")}</div>
      ) : (
        <div
          className="compare-scroll"
          tabIndex={0}
          role="region"
          aria-label={t("Bảng so sánh sản phẩm, có thể cuộn ngang")}
        >
          <table className="compare-table">
            <caption>{language === 'en' ? `Comparing ${selectedProducts.length} products` : `So sánh ${selectedProducts.length} sản phẩm`}</caption>
            <thead>
              <tr>
                <th scope="col">{t("Thông tin")}</th>
                {selectedProducts.map((product) => (
                  <th scope="col" key={product.id}>
                    <img src={product.image} alt={product.name} />
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(product)}
                      aria-label={`${t('Xóa')} ${product.name}`}
                    >{t("Xóa")}</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={t(row.label)}>
                  <th scope="row">{row.label}</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{t(row.value(product))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link className="compare-back" to="/products">{t("← Xem danh sách sản phẩm")}</Link>
    </section>
  );
}
