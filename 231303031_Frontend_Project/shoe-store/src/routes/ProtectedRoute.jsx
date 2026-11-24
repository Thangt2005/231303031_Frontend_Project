import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, openLogin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      openLogin('Vui lòng đăng nhập để tiếp tục');
    }
  }, []);

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

