// src/pages/Admin/BusinessManagement/BusinessManagementPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { Search } from 'lucide-react';

import BusinessesTable from './BusinessesTable';
import Pagination from '../../../components/Pagination';
import { fetchAllBusinesses } from '../../../store/slices/businessManagementSlice';

const ITEMS_PER_PAGE = 5

const BusinessFilters = ({ filters, onFilterChange }) => (
    <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Search className="absolute h-5 w-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <input
                name="search"
                type="text"
                placeholder="Search by business or owner name..."
                value={filters.search}
                onChange={onFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
        </div>
        <select
            name="type"
            value={filters.type}
            onChange={onFilterChange}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        >
            <option value="all">All Types</option>
            <option value="PET_SHOP">Pet Shop</option>
            <option value="VETERINARY_CLINIC">Veterinary Clinic</option>
            <option value="GROOMING_SALON">Grooming Salon</option>
            <option value="HYBRID">Hybrid</option>
        </select>
        <select
            name="statusApproved"
            value={filters.statusApproved}
            onChange={onFilterChange}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
        </select>
    </div>
);

const BusinessManagementPage = () => {
    const dispatch = useDispatch();

    const {
        items: allBusinesses,
        isLoading,
        error
    } = useSelector((state) => state.businessManagement);

    console.log(allBusinesses, 'cek business from komponen utama')

    const [filters, setFilters] = useState({
        search: '',
        type: 'all',
        statusApproved: 'all'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm] = useDebounce(filters.search, 300);

    useEffect(() => {
        dispatch(fetchAllBusinesses({page: 0, size: 100}));
    }, [dispatch]);

    const filteredBusinesses = useMemo(() => {
        if (!Array.isArray(allBusinesses)) return [];

        return allBusinesses.filter(biz => {
            const searchLower = debouncedSearchTerm.toLowerCase();

            const matchesSearch = !searchLower || 
                biz.businessName?.toLowerCase().includes(searchLower) ||
                biz.ownerName?.toLowerCase().includes(searchLower);

            const matchesType = filters.type === 'all' || biz.businessType === filters.type;

            const matchesStatus = filters.statusApproved === 'all' || biz.statusApproved === filters.statusApproved;

            return matchesSearch && matchesType && matchesStatus
        });
    }, [allBusinesses, debouncedSearchTerm, filters])

    const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE)

    const paginatedBusinesses = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredBusinesses.slice(startIndex, endIndex);
    }, [filteredBusinesses, currentPage]);

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [filters, debouncedSearchTerm])

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Business Management</h1>

            <BusinessFilters filters={filters} onFilterChange={handleFilterChange} />
            
            {isLoading && allBusinesses.length === 0 && <p className="text-center py-8">Loading businesses...</p>}
            {error && <p className="text-center py-8 text-red-500">Error: {error}</p>}
            
            {!isLoading && !error && (
                <>
                    <BusinessesTable businesses={paginatedBusinesses} />
                    
                    <div className="mt-6">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default BusinessManagementPage