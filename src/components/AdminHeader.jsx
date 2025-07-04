import { useSelector } from 'react-redux';
import { User } from 'lucide-react';

const AdminHeader = ({ title }) => {
  const admin = useSelector((state) => state.adminAuth.admin)

  return (
    <header className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm top-0 z-10 h-16">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm font-medium text-gray-800">{admin?.name || 'Admin'}</p>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader