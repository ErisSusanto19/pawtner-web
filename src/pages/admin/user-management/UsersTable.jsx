import React from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, CheckCircle, XCircle, ShieldOff } from 'lucide-react';
import defAvatar from '@/assets/undraw_male-avatar_zkzx.svg'

const StatusBadge = ({ isEnable, isNoLocked }) => {
    if (isEnable && isNoLocked) {
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 bg-green-100 text-green-800">
                <CheckCircle size={12} />
                Active
            </span>
        );
    }
    
    return (
        <div className="flex flex-col space-y-1">
            {!isEnable && (
                <span className="px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 bg-red-100 text-red-800">
                    <XCircle size={12} />
                    Banned
                </span>
            )}
            {!isNoLocked && isEnable && (
                <span className="px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 bg-yellow-100 text-yellow-800">
                    <ShieldOff size={12} />
                    Suspended
                </span>
            )}
        </div>
    );
};

const RoleBadge = ({ role }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-md";
    if (role === 'business_owner') {
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Business</span>;
    }
    return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Customer</span>;
};

const UsersTable = ({ users, onAction }) => {
      
    if (!users || users.length === 0) {
        return <p className="text-center text-gray-500 py-8">No users found.</p>;
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
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        {/* {user.imageUrl ? (
                                            <img className="h-10 w-10 rounded-full object-cover" src={user.imageUrl} alt={user.name} />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <UserIcon className="h-6 w-6 text-gray-400"/>
                                            </div>
                                        )} */}
                                        <img 
                                            className="h-10 w-10 rounded-full object-cover" 
                                            src={user.imageUrl || defAvatar} 
                                            alt={user.name}
                                            onError={(e) => {
                                                e.target.onerror = null
                                                e.target.src = defAvatar
                                            }}
                                        />
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
                                <StatusBadge isEnable={user.isEnable} isNoLocked={user.isNoLocked} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <div className="flex items-center space-x-2 md:space-x-4">
                                    <Link to={`/admin/users/${user.id}`} className="text-indigo-600 hover:text-indigo-900">
                                        View
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            onAction('ban', user.id, !user.isEnable)
                                        }}
                                        className={`font-semibold ${
                                            user.isEnable 
                                            ? 'text-green-600 hover:text-green-900'
                                            : 'text-red-600 hover:text-red-900'
                                        }`}
                                        aria-label={user.isEnable ? `Ban ${user.name}` : `Unban ${user.name}`}
                                    >
                                        {user.isEnable ? 'Ban' : 'Unban'}
                                    </button>
                                    {user.isEnable && (
                                        <button 
                                            onClick={() => onAction('suspend', user.id, !user.isNoLocked)}
                                            className={`font-semibold ${
                                                user.isNoLocked 
                                                ? 'text-green-600 hover:text-green-900'
                                                : 'text-yellow-600 hover:text-yellow-900' 
                                            }`}
                                            aria-label={user.isNoLocked ? `Suspend ${user.name}` : `Unsuspend ${user.name}`}
                                        >
                                            {user.isNoLocked ? 'Suspend' : 'Unsuspend'}
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UsersTable;