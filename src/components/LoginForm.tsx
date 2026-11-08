import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router';
import '../styles/login.css';

type LoginFormData = {
  username: string;
  password: string;
  remember: boolean;
};

export default function LoginForm({ onSuccess }: { onSuccess?: (data: LoginFormData) => void }) {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    remember: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSuccess) {
      onSuccess(formData);
    }
  };

  return (
    <div className="login-form-container">
      <h3 className="login-form-title">Đăng nhập</h3>
      <form className="login-form" onSubmit={handleSubmit}>
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

