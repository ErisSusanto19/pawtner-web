import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../store/slices/adminAuthSlice';

const adminMenuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: 'User Management', icon: Users, path: "/admin/users" },
  { name: 'Petshops', icon: Building, path: "/admin/petshops" },
  { name: 'Settings', icon: Settings, path: "/admin/settings" },
]

const getLinkClass = ({ isActive }) => {
  const baseClass = 'flex items-center px-6 py-3 text-sm font-medium transition-colors';
  if (isActive) {
      return `${baseClass} bg-gray-700 text-white`;
  }
  return `${baseClass} text-gray-300 hover:bg-gray-700 hover:text-white`;
};

const AdminSidebarNav = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutAdmin())
    navigate('/admin/login')
  }

  return (
    <aside className="bg-gray-800 text-white h-full flex flex-col border-r border-gray-700">
      <nav className="flex-grow pt-6">
        {adminMenuItems.map((item) => (
          <NavLink key={item.name} to={item.path} end className={getLinkClass}>
            <item.icon className="h-5 w-5 mr-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button onClick={handleLogout} className={`${getLinkClass({ isActive: false })} w-full mt-1 hover:text-red-400`}>
          <LogOut className="h-5 w-5 mr-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebarNav