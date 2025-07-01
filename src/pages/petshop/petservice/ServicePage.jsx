import React, { useMemo, useState } from 'react';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import ServiceModal from './ServiceModal';

const dummyServices = [
    { id: 'svc_01', category: 'grooming', name: 'Premium Full Grooming', base_price: 55000, capacity_per_day: 10, is_active: true },
    { id: 'svc_02', category: 'boarding', name: 'Luxury Pet Suite (per day)', base_price: 35000, capacity_per_day: 5, is_active: true },
    { id: 'svc_03', category: 'veterinary', name: 'Annual Vaccination Package', base_price: 85000, capacity_per_day: 20, is_active: true },
    { id: 'svc_04', category: 'daycare', name: 'Full Day Playtime', base_price: 25000, capacity_per_day: 15, is_active: true },
    { id: 'svc_05', category: 'grooming', name: 'Basic Bath & Brush', base_price: 30000, capacity_per_day: 15, is_active: false },
    { id: 'svc_06', category: 'veterinary', name: 'General Health Check-up', base_price: 60000, capacity_per_day: 25, is_active: true },
];

const getStatusBadge = (isActive) => {
    return isActive 
        ? "bg-green-100 text-green-800"
        : "bg-gray-200 text-gray-800"
};

const ServicePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedService, setSelectedService] = useState(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedStatus, setSelectedStatus] = useState('All')

    const filteredServices = useMemo(() => {
        return dummyServices.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory
            const matchesStatus = selectedStatus === 'All' || String(service.is_active) === selectedStatus
            return matchesSearch && matchesCategory && matchesStatus;
        })
    }, [searchTerm, selectedCategory, selectedStatus])

    const categories = ['All', ...new Set(dummyServices.map(s => s.category))]

    const handleAddNew = () => {
        setSelectedService(null)
        setIsModalOpen(true)
    }

    const handleEdit = (service) => {
        setSelectedService(service)
        setIsModalOpen(true)
    }

    const handleToggleStatus = (serviceId) => {
        console.log(`Toggling status for service ${serviceId}`)
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#495057]">Service Management</h1>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057] transition-colors"
                >
                    <PlusCircle size={16} /> Add New Service
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
                        <input 
                            type="text" 
                            placeholder="Search services..." 
                            className="w-full border border-[#E9ECEF] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white capitalize"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
                    </select>
                    <select 
                        className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F8F9FA] text-left text-[#495057]">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Service Name</th>
                                <th className="py-3 px-4 font-semibold">Category</th>
                                <th className="py-3 px-4 font-semibold">Base Price</th>
                                <th className="py-3 px-4 font-semibold">Capacity/Day</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service) => (
                                <tr key={service.id} className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA]">
                                    <td className="py-3 px-4">
                                        <p className="font-medium text-[#545F71]">{service.name}</p>
                                        <p className="text-xs text-[#ADB5BD]">{service.id}</p>
                                    </td>
                                    <td className="py-3 px-4 text-[#495057] capitalize">{service.category}</td>
                                    <td className="py-3 px-4 text-[#495057]">Rp {service.base_price.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{service.capacity_per_day ?? 'N/A'}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(service.is_active)}`}>
                                            {service.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleEdit(service)}
                                                className="p-1 text-[#545F71] hover:text-blue-600" title="Edit Service">
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => console.log('Delete', service.id)}
                                                className="p-1 text-[#545F71] hover:text-red-600" title="Delete Service">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredServices.length === 0 && (
                        <div className="text-center py-10 text-[#495057]">
                            <p>No services found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <ServiceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                service={selectedService} 
            />
        </div>
    )
}

export default ServicePage