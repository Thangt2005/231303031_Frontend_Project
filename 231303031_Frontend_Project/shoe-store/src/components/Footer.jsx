import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="store-footer">
      <div className="store-container">
        <div className="store-footer-columns">
          <section className="store-footer-intro">
            <Link to="/" className="store-footer-brand">SHOE STORE</Link>
            <p>Giày chính hãng. Phong cách của bạn.</p>
            <h2>KẾT NỐI VỚI CHÚNG TÔI</h2>
            <p>Facebook · Instagram · TikTok</p>
            <h2>PHƯƠNG THỨC THANH TOÁN</h2>
            <div className="store-payment"><span>COD</span><span>CHUYỂN KHOẢN</span></div>
          </section>
          <section>
            <h2>CHĂM SÓC KHÁCH HÀNG</h2>
            <ul><li>Tra cứu đơn hàng</li><li>Hướng dẫn chọn size</li><li>Hướng dẫn mua hàng</li><li>Câu hỏi thường gặp</li></ul>
          </section>
          <section>
            <h2>CHÍNH SÁCH</h2>
            <ul><li>Vận chuyển và giao nhận</li><li>Đổi trả và hoàn tiền</li><li>Bảo hành sản phẩm</li><li>Bảo mật thông tin</li></ul>
          </section>
          <section>
            <h2>VỀ SHOE STORE</h2>
            <ul><li>Câu chuyện thương hiệu</li><li>Hệ thống cửa hàng</li><li>Liên hệ</li><li><Link to="/blog">Tin tức và ưu đãi</Link></li></ul>
          </section>
        </div>
        <div className="store-footer-address">
          <strong>SHOE STORE · NLU</strong>
          <p>NLU, Linh Trung, Thủ Đức, TP HCM</p>
        </div>
        <div className="store-footer-bottom">
          <span>© {new Date().getFullYear()} SHOE STORE. All rights reserved.</span>
          <span>Tiếng Việt | VND</span>
        </div>
      </div>
    </footer>
  );
}
