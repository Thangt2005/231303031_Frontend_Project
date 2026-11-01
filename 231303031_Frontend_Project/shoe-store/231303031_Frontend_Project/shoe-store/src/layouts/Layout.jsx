import { useEffect } from 'react';
import { translate } from '../utils/translations';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/layout.css';

export default function Layout() {
  const language = useSelector((state) => state.language);
  const t = (text) => translate(text, language);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="store-layout">
      <a className="store-skip-link" href="#store-main">{t("Đến nội dung chính")}</a>
      <Header />
      <main
        id="store-main"
        className="store-container store-main"
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
