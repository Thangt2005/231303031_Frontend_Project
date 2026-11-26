import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  // Chưa đăng nhập: chuyển sang trang đăng nhập
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: 'Vui lòng đăng nhập để tiếp tục',
        }}
      />
    );
  }

  return <Outlet />;
}