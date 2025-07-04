import React from 'react';
import { Search } from 'lucide-react';

const UserFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
      {/* Search Input */}
      <div className="relative w-full sm:w-1/2 lg:w-1/3">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          name="search"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={onFilterChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
      </div>

      {/* Role Filter */}
      <div className="w-full sm:w-auto">
        <select
          name="role"
          value={filters.role}
          onChange={onFilterChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        >
          <option value="all">All Roles</option>
          <option value="business_owner">Business Owner</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {/* Verification Status Filter */}
      <div className="w-full sm:w-auto">
        <select
          name="is_verified"
          value={filters.is_verified}
          onChange={onFilterChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        >
          <option value="all">All Statuses</option>
          <option value="true">Verified</option>
          <option value="false">Not Verified</option>
        </select>
      </div>
    </div>
  )
}

export default UserFilters