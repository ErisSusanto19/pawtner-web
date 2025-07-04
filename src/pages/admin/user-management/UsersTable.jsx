import React from 'react';
import { Eye, MoreVertical, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatusBadge = ({ isVerified }) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
  if (isVerified) {
    return <span className={`${baseClasses} bg-green-100 text-green-800`}>Verified</span>
  }
  return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Not Verified</span>
}

const RoleBadge = ({ role }) => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-md";
  if (role === 'business_owner') {
    return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Business</span>
  }
  return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Customer</span>
}


const UsersTable = ({ users, onAction }) => {
  if (users.length === 0) {
    return <p className="text-center text-gray-500 py-8">No users found.</p>
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user.image_url ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={user.image_url} alt={user.name} />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-400"/>
                        </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge isVerified={user.is_verified} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {/* Di dunia nyata, ini akan menjadi komponen dropdown */}
                <Link to={`/admin/users/${user.id}`} className="text-gray-600 hover:text-gray-900">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable