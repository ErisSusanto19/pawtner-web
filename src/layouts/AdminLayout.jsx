import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import AdminSidebarHead from '../components/AdminSidebarHead';
import AdminSidebarNav from '../components/AdminSidebarNav';

const getAdminTitle = (path) => {
    const segments = path.split('/').filter(Boolean)
    if (segments.length < 2) return 'Admin';
    const title = segments[1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    return title
}

const AdminLayout = () => {
  const location = useLocation()
  const title = getAdminTitle(location.pathname)

  return (
    <div className="h-screen grid grid-cols-[256px_1fr] grid-rows-[64px_1fr]">
        
        <div className="row-start-1 col-start-1">
            <AdminSidebarHead />
        </div>

        <div className="row-start-1 col-start-2">
            <AdminHeader title={title} />
        </div>
        
        <div className="row-start-2 col-start-1 overflow-y-auto">
            <AdminSidebarNav />
        </div>

        <main className="row-start-2 col-start-2 overflow-y-auto p-6 bg-gray-100">
            <Outlet />
        </main>

    </div>
  )
}

export default AdminLayout