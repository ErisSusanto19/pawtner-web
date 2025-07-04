import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export const mockBusinesses = [
    {
      id: 1,
      owner_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      name: 'Pawtner Pet Care',
      description: 'Klinik hewan dan petshop terlengkap di kota Anda.',
      business_type: 'HYBRID',
      has_emergency_services: true,
      business_email: 'contact@pawtnercare.com',
      business_phone: '021-123-4567',
      emergency_phone: '0812-111-2222',
      business_image_url: 'https://cdn.pixabay.com/photo/2025/02/20/07/51/ai-generated-9419220_640.png',
      certificate_image_url: 'https://via.placeholder.com/300/CCCCCC/FFFFFF?text=Certificate',
      address: 'Jl. Merdeka No. 1, Jakarta',
      latitude: -6.200000,
      longitude: 106.816666,
      is_verified: true,
      operation_hours: { "Monday": "08:00-20:00", "Tuesday": "08:00-20:00" },
      status_realtime: 'Accepting Patients',
      created_at: '2023-10-20T10:00:00Z',
    },
    {
      id: 2,
      owner_id: 'd4e5f6a7-b8c9-0123-4567-890abcdef3',
      name: 'Grooming Kingdom',
      description: 'Salon perawatan hewan kesayangan.',
      business_type: 'GROOMING_SALON',
      has_emergency_services: false,
      business_email: 'hello@groomingkingdom.com',
      business_phone: '022-987-6543',
      emergency_phone: null,
      business_image_url: 'https://cdn.pixabay.com/photo/2025/02/20/07/51/ai-generated-9419220_640.png',
      certificate_image_url: 'https://via.placeholder.com/300/CCCCCC/FFFFFF?text=Certificate',
      address: 'Jl. Bahagia No. 10, Bandung',
      latitude: -6.917464,
      longitude: 107.619125,
      is_verified: false,
      operation_hours: { "Tuesday": "09:00-17:00", "Wednesday": "09:00-17:00" },
      status_realtime: 'Closed',
      created_at: '2023-10-22T14:00:00Z',
    },
]

const BusinessesTable = ({ businesses }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emergency</th>
            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {businesses.map((biz) => (
            <tr key={biz.id}>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-md object-cover" src={biz.business_image_url} alt={biz.name} />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{biz.name}</div>
                    <div className="text-sm text-gray-500">{biz.business_email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-700">{biz.business_type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
              </td>
              <td className="px-6 py-4">
                {biz.is_verified ? 
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Verified</span> : 
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                }
              </td>
              <td className="px-6 py-4">
                {biz.has_emergency_services ? 'Yes' : 'No'}
              </td>
              <td className="px-6 py-4 text-right">
                <Link to={`/admin/businesses/${biz.id}`} className="text-gray-600 hover:text-gray-900">
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

const BusinessManagementPage = () => {
  const [businesses, setBusinesses] = useState([])
  const [filters, setFilters] = useState({ search: '', type: 'all', verified: 'all' })

  useEffect(() => {
    setBusinesses(mockBusinesses)
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(biz => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = biz.name.toLowerCase().includes(searchLower) || biz.business_email?.toLowerCase().includes(searchLower)
      const matchesType = filters.type === 'all' || biz.business_type === filters.type
      const matchesVerified = filters.verified === 'all' || String(biz.is_verified) === filters.verified
      return matchesSearch && matchesType && matchesVerified
    })
  }, [businesses, filters])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Business Management</h1>
      
      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-1/3">
          <Search className="absolute h-5 w-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input name="search" type="text" placeholder="Search by name or email..." value={filters.search} onChange={handleFilterChange} className="w-full pl-10 pr-4 py-2 border rounded-md"/>
        </div>
        <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full sm:w-auto px-4 py-2 border rounded-md">
          <option value="all">All Types</option>
          <option value="VETERINARY_CLINIC">Veterinary Clinic</option>
          <option value="PET_SHOP">Pet Shop</option>
          <option value="GROOMING_SALON">Grooming Salon</option>
          <option value="BOARDING_DAYCARE">Boarding/Daycare</option>
          <option value="HYBRID">Hybrid</option>
        </select>
        <select name="verified" value={filters.verified} onChange={handleFilterChange} className="w-full sm:w-auto px-4 py-2 border rounded-md">
          <option value="all">All Statuses</option>
          <option value="true">Verified</option>
          <option value="false">Pending</option>
        </select>
      </div>
      
      <BusinessesTable businesses={filteredBusinesses} />
    </div>
  )
}

export default BusinessManagementPage