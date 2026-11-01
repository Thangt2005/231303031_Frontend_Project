import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CompareProvider } from '../context/CompareContext';
import '../styles/layout.css';

export default function Layout() {
  return (
    <CompareProvider>
    <div className="store-layout">
      <a className="store-skip-link" href="#store-main">Đến nội dung chính</a>
      <Header />
      <main id="store-main" className="store-container store-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
    </CompareProvider>
  );
}

