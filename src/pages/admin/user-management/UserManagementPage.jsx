import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';

import UserFilters from './UserFilters';
import UsersTable from './UsersTable';
import Pagination from '../../../components/Pagination';
import ConfirmationModal from '../../../components/ConfirmationModal';

import { fetchAllUsers, toggleUserStatusAction } from '../../../store/slices/userManagementSlice';

const ITEMS_PER_PAGE = 5;

const UserManagementPage = () => {
    const dispatch = useDispatch();

    const {
        items: allUsers,
        isLoading,
        error,
    } = useSelector((state) => state.userManagement);

    const [filters, setFilters] = useState({
        search: '',
        role: 'all',
        isEnable: 'all',
        isNoLocked: 'all',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm] = useDebounce(filters.search, 300);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            const searchLower = debouncedSearchTerm.toLowerCase();
            
            const matchesSearch = !searchLower || 
                user.name?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower);

            const matchesRole = filters.role === 'all' || user.role === filters.role;

            const matchesEnabled = filters.isEnable === 'all' || String(user.isEnable) === filters.isEnable;
            
            const matchesLocked = filters.isNoLocked === 'all' || String(user.isNoLocked) === filters.isNoLocked;

            return matchesSearch && matchesRole && matchesEnabled && matchesLocked;
        });
    }, [allUsers, debouncedSearchTerm, filters]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, currentPage]);

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [filters, debouncedSearchTerm]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleAction = (action, userId, value) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return;
        const verb = action === 'ban' ? (value ? 'unban' : 'ban') : (value ? 'unsuspend' : 'suspend');
        setConfirmationData({
            title: `Confirm ${verb.charAt(0).toUpperCase() + verb.slice(1)}`,
            message: `Are you sure you want to ${verb} the user "${user.name}"?`,
            onConfirm: () => handleConfirmAction({ userId, action, value }),
        });
        setIsModalOpen(true);
    };

    const handleConfirmAction = async ({ userId, action, value }) => {
        setIsSubmitting(true);
        const verb = action === 'ban' ? (value ? 'unbanned' : 'banned') : (value ? 'unsuspended' : 'suspended');
        try {
            await dispatch(toggleUserStatusAction(userId, action, value))
            toast.success(`User has been successfully ${verb}.`);
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

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>
            
            <UserFilters filters={filters} onFilterChange={handleFilterChange} />
            
            {isLoading && allUsers.length === 0 && <p className="text-center py-8">Loading users...</p>}
            {error && <p className="text-center py-8 text-red-500">Error: {error}</p>}
            
            {!isLoading && !error && (
                <>
                    <UsersTable users={paginatedUsers} onAction={handleAction} />
                    
                    <div className="mt-6">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}

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

export default UserManagementPage