import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { useCart } from '../context/CartContext';
import '../styles/layout.css';

export function Layout() {
    const { totalItems } = useCart();

    return (
        <div className="store-layout">
            <ScrollToTop />
            <a className="store-skip-link" href="#store-main">Đến nội dung chính</a>
            <Header cartCount={totalItems} />
            <main id="store-main" className="store-container store-main" tabIndex={-1}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
