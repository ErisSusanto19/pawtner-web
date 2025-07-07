import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, User as UserIcon, CheckCircle, XCircle, ShieldCheck, ShieldOff, AlertTriangle } from 'lucide-react';
import { fetchUserById, toggleUserStatusAction, clearSelectedUser } from '../../../store/slices/userManagementSlice';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { toast } from 'react-toastify';

const UserProfileCard = ({ user }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="flex-shrink-0">
                {user.imageUrl ? (
                    <img src={user.imageUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-200" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-gray-200">
                        <UserIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>
            <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-md text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">{user.phone || 'No phone number'}</p>
                {/* --- PERUBAHAN: Tampilan status di profil --- */}
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    {user.isEnable && user.isNoLocked && (
                        <span className="flex items-center gap-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full"><ShieldCheck size={14}/> Active</span>
                    )}
                    {!user.isEnable && (
                        <span className="flex items-center gap-1 text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full"><XCircle size={14}/> Banned</span>
                    )}
                    {!user.isNoLocked && (
                        <span className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"><AlertTriangle size={14}/> Suspended</span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

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
                <span className="text-gray-800 capitalize">{user.role ? user.role.replace('_', ' ') : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Joined Date:</span>
                <span className="text-gray-800">{new Date(user.createdAt).toLocaleString()}</span>
            </div>
        </div>
    </div>
);

const AdminActionsCard = ({ user, onAction }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Admin Actions</h3>
        <div className="space-y-6">
            {/* Ban/Unban Action */}
            <div>
                <p className="text-sm font-semibold mb-2 text-gray-700">Ban Status</p>
                {user.isEnable ? (
                    <button onClick={() => onAction('ban', user.id, false)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
                        <XCircle size={16} /> Ban User
                    </button>
                ) : (
                    <button onClick={() => onAction('ban', user.id, true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-md hover:bg-green-200 transition-colors">
                        <CheckCircle size={16} /> Unban User
                    </button>
                )}
                <p className="text-xs text-gray-500 mt-2">
                    {user.isEnable ? 'Banning a user will prevent them from logging in and using the app.' : 'Unbanning will restore full account access if not suspended.'}
                </p>
            </div>
            
            {/* Suspend/Unsuspend Action */}
            <div>
                <p className="text-sm font-semibold mb-2 text-gray-700">Suspend Status</p>
                {user.isNoLocked ? (
                    <button onClick={() => onAction('suspend', user.id, false)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors">
                        <AlertTriangle size={16} /> Suspend User
                    </button>
                ) : (
                    <button onClick={() => onAction('suspend', user.id, true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-md hover:bg-green-200 transition-colors">
                        <ShieldCheck size={16} /> Unsuspend User
                    </button>
                )}
                <p className="text-xs text-gray-500 mt-2">
                    {user.isNoLocked ? 'Suspending a user is a temporary measure, often used for warnings.' : 'Unsuspending restores account access if not banned.'}
                </p>
            </div>
        </div>
    </div>
);

const UserDetailPage = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const { 
        selectedUser: user,
        isLoading,
        error 
    } = useSelector((state) => state.userManagement);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (userId) {
            dispatch(fetchUserById(userId));
        }
        return () => {
            dispatch(clearSelectedUser());
        };
    }, [dispatch, userId]);

    const handleAdminAction = (action, targetUserId, value) => {
        const verb = action === 'ban' ? (value ? 'unban' : 'ban') : (value ? 'unsuspend' : 'suspend');

        setConfirmationData({
            title: `Confirm ${verb.charAt(0).toUpperCase() + verb.slice(1)}`,
            message: `Are you sure you want to ${verb} this user?`,
            onConfirm: () => handleConfirmAction({ userId: targetUserId, action, value }),
        });
        setIsModalOpen(true);
    };

    const handleConfirmAction = async ({ userId, action, value }) => {
        setIsSubmitting(true);
        const verb = action === 'ban' ? (value ? 'unbanned' : 'banned') : (value ? 'unsuspended' : 'suspended');
        
        try {
            const response = await dispatch(toggleUserStatusAction(userId, action, value))
            toast.success(response.message || `User has been successfully ${verb}.`);
        } catch (err) {
            toast.error(err.message || `Failed to update user status.`);
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
            setConfirmationData(null);
        }
    };

    const handleCloseModal = () => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        setConfirmationData(null);
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading user details...</div>;
    }

    if (error) {
        return (
            <div className="text-center p-8 text-red-500">
                <p>Error: {error}</p>
                <Link to="/admin/users" className="text-indigo-600 hover:underline mt-4 inline-block">Go back to list</Link>
            </div>
        );
    }

    if (!user) {
        return <div className="text-center p-8">User not found.</div>;
    }

    return (
        <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
            <div>
                <Link to="/admin/users" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft size={16} />
                    Back to User List
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
            </div>
      
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <UserProfileCard user={user} />
                    <AccountDetailsCard user={user} />
                </div>
                <div className="lg:col-span-1">
                    <AdminActionsCard user={user} onAction={handleAdminAction} />
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={confirmationData?.onConfirm}
                title={confirmationData?.title}
                message={confirmationData?.message}
                isLoading={isSubmitting}
            />

        </div>
    );
}

export default UserDetailPage;