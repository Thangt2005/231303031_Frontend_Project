import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(formData.username, formData.password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError('');
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="login-form-container">
      <h3 className="login-form-title">Đăng nhập</h3>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="login-error-message">{error}</div>}

        <div className="login-form-group">
          <label htmlFor="username">Tài khoản</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Email hoặc tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-form-options">
          <label className="login-remember">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            Ghi nhớ
          </label>
          <Link to="/login" className="login-forgot-link">Quên mật khẩu?</Link>
        </div>

        <button type="submit" className="login-submit-btn">
          Đăng nhập
        </button>

        <div className="login-form-footer">
          Chưa có tài khoản? <Link to="/login">Đăng ký ngay</Link>
        </div>
      </form>
    </div>
  );
}
