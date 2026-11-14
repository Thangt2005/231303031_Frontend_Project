import { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import '../../styles/login.css';

export default function ForgotPasswordForm() {
  const { resetPass } = useAuth();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (newPassword) setNewPassword('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedPassword = `Shoe@${randomSuffix}`;

    const result = resetPass(email, generatedPassword);

    if (!result.success) {
      setError(result.message || 'Email không tồn tại');
      setNewPassword('');
      return;
    }

    setError('');
    setNewPassword(generatedPassword);
  };

  return (
    <div className="login-form-container">
      <h3 className="login-form-title">Quên mật khẩu</h3>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="login-error-message">{error}</div>}

        <div className="login-form-group">
          <label htmlFor="email">Email tài khoản *</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={handleChange}
            required
          />
          {newPassword && (
            <span className="forgot-password-hint">
              Đã gửi mật khẩu mới. Mật khẩu mới: <strong>{newPassword}</strong>.
            </span>
          )}
        </div>

        <button type="submit" className="login-submit-btn">
          Lấy lại mật khẩu
        </button>

        <div className="login-form-footer">
          Đã nhớ mật khẩu? <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </form>
    </div>
  );
}

