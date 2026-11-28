import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import '../../styles/login.css';

export default function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Ở trang /login đã có form đăng nhập rồi nên không mở thêm khung này
    if (location.state?.message && location.pathname !== '/login') {
      setIsOpen(true);
    }
  }, [location.state, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLoginSuccess = () => {
    setIsOpen(false);
    const target = location.state?.from || '/';
    navigate(target, { replace: true, state: {} });
  };

  return (
    <div className="login-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="action-link login-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{user ? user.username : 'ĐĂNG NHẬP'}</span>
      </button>

      <div className={`login-dropdown-menu ${isOpen ? 'open' : ''}`}>
        {user ? (
          <div className="login-user-menu">
            <p className="login-user-name">Xin chào, {user.username}</p>
            <Link
              to="/account"
              className="login-submit-btn"
              style={{ textAlign: 'center', textDecoration: 'none' }}
              onClick={() => setIsOpen(false)}
            >
              Tài khoản của tôi
            </Link>
            <button
              type="button"
              className="login-logout-btn"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <LoginForm onSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}