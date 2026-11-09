import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import '../styles/layout.css';

export default function Layout() {
  const { totalQuantity } = useCart();

  return (
    <div className="store-layout">
      <a className="store-skip-link" href="#store-main">Đến nội dung chính</a>
      <Header cartCount={totalQuantity} />
      <main id="store-main" className="store-container store-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
