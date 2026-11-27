import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import '../../styles/login.css';

export default function LoginDropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isLoginOpen, openLogin, closeLogin, loginMessage } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    if (isLoginPage) {
      closeLogin();
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeLogin();
      }
    };

    if (isLoginOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLoginOpen]);

  const handleLoginSuccess = () => {
    closeLogin();
    const target = location.state?.from;
    if (target && target !== '/' && target !== location.pathname) {
      navigate(target, { replace: true, state: {} });
    }
  };

  const handleLogout = () => {
    closeLogin();
    logout();
  };

  return (
    <div className="login-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="action-link login-toggle-btn"
        onClick={() => {
          if (isLoginPage) return;
          if (isLoginOpen) {
            closeLogin();
          } else {
            openLogin();
          }
        }}
      >
        <span>{user ? user.username : 'ĐĂNG NHẬP'}</span>
      </button>

      {!isLoginPage && isLoginOpen && (
        <div className="login-dropdown-menu open">
          {user ? (
            <div className="login-user-menu">
              <p className="login-user-name">Xin chào, {user.username}</p>
              <Link
                to="/orders"
                className="login-menu-link"
                onClick={closeLogin}
              >
                Đơn hàng
              </Link>
              <button
                type="button"
                className="login-logout-btn"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <LoginForm onSuccess={handleLoginSuccess} message={loginMessage} />
          )}
        </div>
      )}
    </div>
  );
}
