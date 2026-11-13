import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    otp: '',
  });

  const [genOtp, setgenOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
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

    const randOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setgenOtp(randOtp);
    setOtpMessage(`Đã gửi mã OTP đến email. Mã OTP của bạn là: ${randOtp}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

      if (!genOtp) {
        setError('Vui lòng bấm Gửi OTP để nhận mã xác nhận');
        return;
      }

        if (formData.otp !== genOtp) {
          setError('Mã OTP không chính xác');
          return;
        }

        if (formData.password.length < 8) {
          setError('Mật khẩu phải có tối thiểu 8 ký tự');
          return;
        }

        if (!/[A-Z]/.test(formData.password)) {
          setError('Mật khẩu phải có ít nhất 1 chữ hoa');
          return;
        }

        if (!/[0-9]/.test(formData.password)) {
          setError('Mật khẩu phải có ít nhất 1 số');
          return;
        }

        if (!/[^A-Za-z0-9]/.test(formData.password)) {
          setError('Mật khẩu phải có ít nhất 1 ký tự đặc biệt');
          return;
        }

        const result = register({
          username: formData.username,
          password: formData.password,
          name: formData.fullName,
          email: formData.email,
        });

        if (!result.success) {
          setError(result.message || 'Đăng ký thất bại');
          return;
        }

        setError('');
        navigate('/', { replace: true });
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
                maxLength={15}
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
                maxLength={25}
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
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
                placeholder="Tối thiểu 8 ký tự (hoa, số, ký tự đặc biệt)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="otp">Mã OTP *</label>
              <div className="register-otp-row">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  minLength={6}
                />
                <button
                  type="button"
                  className="register-otp-btn"
                  onClick={handleSendOtp}
                >
                  {genOtp ? 'Gửi lại' : 'Gửi OTP'}
                </button>
              </div>
              {otpMessage && (
                <span className="register-otp-hint">{otpMessage}</span>
              )}
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
