import { Link } from 'react-router';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

export default function Login() {
  const { user, logout } = useAuth();

  return (
    <div className="login-page-wrapper">
      {user ? (
        <div className="login-user-menu">
          <p className="login-user-name">Đã đăng nhập: {user.username}</p>
          <button type="button" className="login-logout-btn" onClick={logout}>
            Đăng xuất
          </button>
          <Link to="/" className="login-submit-btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
            Về trang chủ
          </Link>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

