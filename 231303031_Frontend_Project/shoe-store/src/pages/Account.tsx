import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import '../styles/account.css';

export function Account() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // ProtectedRoute đã kiểm tra đăng nhập, đây chỉ kiểm tra lại cho chắc
    if (!user) {
        return null;
    }

    // Về trang chủ trước rồi mới đăng xuất,
    // nếu đăng xuất trước thì guard sẽ chuyển sang trang đăng nhập
    function handleLogout() {
        navigate('/');
        logout();
    }

    return (
        <section className="account-page">
            <h1>Tài khoản của tôi</h1>
            <p className="account-hello">
                Xin chào, <strong>{user.name}</strong>!
            </p>

            <table className="account-info">
                <tbody>
                    <tr>
                        <th>Tên đăng nhập</th>
                        <td>{user.username}</td>
                    </tr>
                    <tr>
                        <th>Họ và tên</th>
                        <td>{user.name}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{user.email}</td>
                    </tr>
                    <tr>
                        <th>Số điện thoại</th>
                        <td>{user.sdt || 'Chưa cập nhật'}</td>
                    </tr>
                    <tr>
                        <th>Địa chỉ</th>
                        <td>{user.address || 'Chưa cập nhật'}</td>
                    </tr>
                </tbody>
            </table>

            <div className="account-actions">
                <Link to="/orders" className="account-button">Đơn hàng của tôi</Link>
                <button type="button" className="account-logout" onClick={handleLogout}>
                    Đăng xuất
                </button>
            </div>
        </section>
    );
}