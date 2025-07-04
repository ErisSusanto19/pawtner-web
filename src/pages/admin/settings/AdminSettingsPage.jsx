import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { User, Lock, SlidersHorizontal } from 'lucide-react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const ProfileSettings = () => {
    const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm({ mode: 'onChange' })
    const admin = useSelector(state => state.adminAuth.admin)

    const onSubmitPassword = (data) => {
        console.log("Changing password with data:", data)
        alert("Password change simulated!")
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
            <div className="mb-6">
                <p className="font-semibold">Name:</p>
                <p>{admin?.name || 'Super Admin'}</p>
                <p className="font-semibold mt-2">Email:</p>
                <p>{admin?.email || 'admin@pawtner.com'}</p>
            </div>
            
            <hr className="my-6" />

            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4 max-w-sm">
                <Input id="currentPassword" label="Current Password" type="password" register={register} errors={errors} rules={{ required: "Current password is required." }} />
                <Input id="newPassword" label="New Password" type="password" register={register} errors={errors} rules={{ required: "New password is required.", minLength: { value: 8, message: "Password must be at least 8 characters."} }} />
                <Input id="confirmPassword" label="Confirm New Password" type="password" register={register} errors={errors} rules={{ required: "Please confirm your new password.", validate: (value) => value === watch('newPassword') || "Passwords do not match." }} />
                <Button type="submit" disabled={!isValid}>Update Password</Button>
            </form>
        </div>
    )
}

const SystemSettings = () => {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

    const handleToggleMaintenance = () => {
        if (window.confirm(`Are you sure you want to ${isMaintenanceMode ? 'disable' : 'enable'} maintenance mode?`)) {
            setIsMaintenanceMode(!isMaintenanceMode)
            console.log("Maintenance mode set to:", !isMaintenanceMode)
            alert(`Maintenance mode has been ${!isMaintenanceMode ? 'enabled' : 'disabled'}.`)
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">System Settings</h2>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <h4 className="font-semibold">Maintenance Mode</h4>
                    <p className="text-sm text-gray-500">
                        When enabled, all users except admins will see a maintenance page.
                    </p>
                </div>
                <label htmlFor="maintenance-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id="maintenance-toggle" className="sr-only" checked={isMaintenanceMode} onChange={handleToggleMaintenance} />
                        <div className={`block w-14 h-8 rounded-full ${isMaintenanceMode ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isMaintenanceMode ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                </label>
            </div>

        </div>
    )
}

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="mb-6 border-b">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-gray-800 text-gray-800'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User size={16} /> Profile & Security
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'system'
                ? 'border-gray-800 text-gray-800'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal size={16} /> System
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'system' && <SystemSettings />}
      </div>
    </div>
  )
}

export default AdminSettingsPage