import { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

export default function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [newPass, setnewPass] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (newPass) setnewPass('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const random = Math.floor(1000 + Math.random() * 9000);
    const genPass = `Shoe@${random}`;

    const result = resetPassword(email, genPass);

    if (!result.success) {
      setError(result.message || 'Email không tồn tại');
      setnewPass('');
      return;
    }

    setError('');
    setnewPass(genPass);
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
          {newPass && (
            <div className="forgot-password-hint">
              Mật khẩu mới của bạn là: <strong>{newPass}</strong>. Vui lòng sử dụng mật khẩu này để đăng nhập!
            </div>
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
