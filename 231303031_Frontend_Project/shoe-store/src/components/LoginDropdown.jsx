import { useState } from 'react';
import LoginForm from './LoginForm';
import '../styles/login.css';

export default function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="login-dropdown-wrapper">
      <button
        type="button"
        className="login-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="store-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
        </svg>
        <span>Đăng nhập</span>
      </button>

      <div className={`login-dropdown-menu ${isOpen ? 'open' : ''}`}>
        <LoginForm onSuccess={() => setIsOpen(false)} />
      </div>
    </div>
  );
}

