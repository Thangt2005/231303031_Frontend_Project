import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { CompareContext } from '../context/CompareContext';
import { getProducts } from '../services/productService';
import '../styles/compare.css';

export default function Compare() {
  const { selectedProducts, addProduct, removeProduct } = useContext(CompareContext);
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
        if (!Array.isArray(data)) throw new Error('Dữ liệu sản phẩm không hợp lệ.');
        if (active) setProducts(data);
      } catch (error) {
        if (active) setError(error.message || 'Không tải được sản phẩm.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProducts();
    return () => { active = false; };
  }, []);

  function handleAdd(event) {
    event.preventDefault();
    const product = products.find((item) => String(item.id) === selectedId);
    if (!product) { setMessage('Hãy chọn sản phẩm trước khi thêm.'); return; }
    if (selectedProducts.some((item) => item.id === product.id)) { setMessage('Sản phẩm này đã có trong bảng so sánh.'); return; }
    if (selectedProducts.length >= 3) { setMessage('Chỉ được so sánh tối đa 3 sản phẩm. Hãy xóa một sản phẩm trước.'); return; }
    addProduct(product);
    setSelectedId('');
    setMessage('Đã thêm ' + product.name + ' vào bảng so sánh.');
  }

  function handleRemove(product) {
    removeProduct(product.id);
    setMessage('Đã xóa ' + product.name + ' khỏi bảng so sánh.');
  }

  const rows = [
    { label: 'Giá', value: (product) => typeof product.price === 'number' ? product.price.toLocaleString('vi-VN') + ' đ' : 'Chưa có thông tin' },
    { label: 'Thương hiệu', value: (product) => product.brand || 'Chưa có thông tin' },
    { label: 'Loại giày', value: (product) => product.category || 'Chưa có thông tin' },
    { label: 'Màu sắc', value: (product) => product.colors?.join(', ') || 'Chưa có thông tin' },
    { label: 'Kích cỡ', value: (product) => product.sizes?.join(', ') || 'Chưa có thông tin' },
    { label: 'Mô tả', value: (product) => product.description || 'Chưa có thông tin' },
  ];

  return (
    <section className="compare-page">
      <p className="compare-eyebrow">TÌM ĐÔI GIÀY PHÙ HỢP</p>
      <h1>So sánh sản phẩm</h1>
      <p>Chọn tối đa 3 sản phẩm để xem các thông tin cạnh nhau.</p>
      {loading ? <p role="status">Đang tải sản phẩm...</p> : error ? <p role="alert">{error}</p> : products.length === 0 ? <p>Chưa có sản phẩm để chọn.</p> : (
        <form className="compare-picker" onSubmit={handleAdd}>
          <label htmlFor="compare-product">Chọn sản phẩm</label>
          <select id="compare-product" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            <option value="">-- Chọn một đôi giày --</option>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
          <button type="submit">Thêm để so sánh</button>
        </form>
      )}
      <p role="status" className="compare-message">{message || `Đã chọn ${selectedProducts.length}/3 sản phẩm.`}</p>
      {selectedProducts.length === 0 ? <div className="compare-empty">Bảng so sánh đang trống. Chọn sản phẩm ở phía trên để bắt đầu.</div> : (
        <div className="compare-scroll" tabIndex={0} role="region" aria-label="Bảng so sánh sản phẩm, có thể cuộn ngang">
          <table className="compare-table">
            <caption>So sánh {selectedProducts.length} sản phẩm</caption>
            <thead><tr><th scope="col">Thông tin</th>{selectedProducts.map((product) => (
              <th scope="col" key={product.id}>
                <img src={product.image} alt={product.name} />
                <Link to={`/products/${product.id}`}>{product.name}</Link>
                <button type="button" onClick={() => handleRemove(product)} aria-label={`Xóa ${product.name}`}>Xóa</button>
              </th>
            ))}</tr></thead>
            <tbody>{rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th>{selectedProducts.map((product) => <td key={product.id}>{row.value(product)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
      <Link className="compare-back" to="/products">← Xem danh sách sản phẩm</Link>
    </section>
  );
}
