import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const AdminRootLayout = () => {
  const { isAdminAuthenticated } = useSelector((state) => state.adminAuth)

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

export default AdminRootLayout