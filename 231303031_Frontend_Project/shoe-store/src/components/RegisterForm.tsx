import { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router';
import '../styles/login.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSendOtp = () => {
    if (!formData.email) {
      setError('Vui lòng nhập email trước khi gửi OTP');
      return;
    }
    setOtpSent(true);
    setSuccess(`Đã gửi OTP đến ${formData.email}`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setError('Vui lòng gửi và nhập OTP để xác nhận email');
      return;
    }
    if (!formData.otp) {
      setError('Vui lòng nhập mã OTP');
      return;
    }
    setError('');
    alert('Đăng ký thành công! (UI demo)');
  };

  return (
    <div className="login-form-container">
      <h3 className="login-form-title">Đăng ký</h3>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="login-error-message">{error}</div>}
        {success && <div className="login-success-message">{success}</div>}

        <div className="login-form-group">
          <label htmlFor="username">Tên người dùng *</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-form-group">
          <label htmlFor="fullName">Họ và tên <span className="register-optional"></span></label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nguyễn Văn A"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="login-form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-form-group">
          <label htmlFor="password">Mật khẩu *</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-form-group">
          <label htmlFor="otp">Mã OTP</label>
          <div className="register-otp-row">
            <input
              id="otp"
              name="otp"
              type="text"
              placeholder="Nhập mã OTP"
              value={formData.otp}
              onChange={handleChange}
            />
            <button
              type="button"
              className="register-otp-btn"
              onClick={handleSendOtp}
            >
              {otpSent ? 'Gửi lại' : 'Gửi OTP'}
            </button>
          </div>
        </div>

        <button type="submit" className="login-submit-btn">
          Đăng ký
        </button>

        <div className="login-form-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </form>
    </div>
  );
}

