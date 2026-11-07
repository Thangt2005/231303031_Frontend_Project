import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/"
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

