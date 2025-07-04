import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, ShieldCheck, ShieldOff, Lock, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { mockUsers } from './UserManagementPage'

const UserProfileCard = ({ user }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
      <div className="flex-shrink-0">
        {user.image_url ? (
          <img src={user.image_url} alt={user.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-200" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-gray-200">
            <UserIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-md text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-500 mt-1">{user.phone_number || 'No phone number'}</p>
        <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
            {user.is_verified ? 
                <span className="flex items-center gap-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full"><ShieldCheck size={14}/> Verified</span> : 
                <span className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"><ShieldOff size={14}/> Not Verified</span>
            }
        </div>
      </div>
    </div>
  </div>
)

const AccountDetailsCard = ({ user }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Account Details</h3>
    <div className="space-y-3 text-sm">
        <div className="flex justify-between">
            <span className="font-semibold text-gray-600">User ID:</span>
            <span className="text-gray-800 font-mono text-xs">{user.id}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Role:</span>
            <span className="text-gray-800 capitalize">{user.role.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Auth Provider:</span>
            <span className="text-gray-800 capitalize">{user.auth_provider}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Joined Date:</span>
            <span className="text-gray-800">{new Date(user.created_at).toLocaleString()}</span>
        </div>
    </div>
  </div>
)

const AdminActionsCard = ({ user, onAction }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Admin Actions</h3>
        <div className="space-y-4">
            <div>
                <p className="text-sm font-semibold mb-2">Email Verification</p>
                {user.is_verified ? (
                    <button onClick={() => onAction('unverify')} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-md hover:bg-yellow-200">
                        <XCircle size={16} /> Mark as Not Verified
                    </button>
                ) : (
                    <button onClick={() => onAction('verify')} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-md hover:bg-green-200">
                        <CheckCircle size={16} /> Mark as Verified
                    </button>
                )}
            </div>

             <div>
                <p className="text-sm font-semibold mb-2">Account Status</p>
                <button onClick={() => onAction('suspend')} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-md hover:bg-red-200">
                    <Trash2 size={16} /> Suspend Account
                </button>
            </div>

            <div>
                <p className="text-sm font-semibold mb-2">Password</p>
                <button onClick={() => onAction('reset_password')} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-md hover:bg-blue-200">
                    <Lock size={16} /> Send Password Reset Link
                </button>
            </div>
        </div>
    </div>
)

const UserDetailPage = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.id === userId)
      setUser(foundUser)
      setIsLoading(false)
    }, 500)
  }, [userId])
  
  const handleAdminAction = (action) => {
      if (window.confirm(`Are you sure you want to perform this action: ${action.toUpperCase()}?`)) {
          console.log(`Performing action: ${action} on user ${user.name}`)

          alert(`Action "${action}" performed successfully (simulated).`)

          if(action === 'verify') setUser(prev => ({...prev, is_verified: true}))
          if(action === 'unverify') setUser(prev => ({...prev, is_verified: false}))

      }
  }

  if (isLoading) {
    return <p>Loading user details...</p>
  }

  if (!user) {
    return <p>User not found.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/users" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} />
          Back to User List
        </Link>
        <h1 className="text-2xl font-bold">User Details</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Info Utama */}
        <div className="lg:col-span-2 space-y-6">
            <UserProfileCard user={user} />
            <AccountDetailsCard user={user} />
        </div>

        {/* Kolom Kanan: Aksi Admin */}
        <div className="lg:col-span-1">
            <AdminActionsCard user={user} onAction={handleAdminAction} />
        </div>
      </div>
    </div>
  )
}

export default UserDetailPage