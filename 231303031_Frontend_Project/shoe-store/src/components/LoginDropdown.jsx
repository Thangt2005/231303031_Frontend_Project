import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import '../styles/login.css';

export default function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="login-dropdown-wrapper">
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
          <LoginForm onSuccess={() => setIsOpen(false)} />
        )}
      </div>
    </div>
  );
}
