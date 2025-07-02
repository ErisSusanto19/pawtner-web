import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Save, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatCurrencyIDR } from '../../../utils/formatter';
import { dummyServices } from './ServicePage'

const serviceCategories = ['grooming', 'boarding', 'veterinary', 'daycare', 'training']

const getStatusBadge = (isActive) => {
    return isActive 
        ? { label: 'Active', className: "bg-green-100 text-green-800" }
        : { label: 'Inactive', className: "bg-gray-200 text-gray-800" }
}

const fetchServiceById = async (id) => {
    await new Promise(res => setTimeout(res, 500))
    const service = dummyServices.find(s => s.id === id)
    if (!service) throw new Error("Service not found")
    return service
}

const updateService = async (id, updatedData) => {
    await new Promise(res => setTimeout(res, 1000))
    console.log("Updating service", id, "with", updatedData)
    return { ...updatedData, id }
};

const ServiceDetailPage = () => {
    const { serviceId } = useParams()
    const navigate = useNavigate()

    const [service, setService] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})

    useEffect(() => {
        const loadService = async () => {
            try {
                setLoading(true)
                const data = await fetchServiceById(serviceId)
                setService(data)
                setFormData(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        };
        loadService()
    }, [serviceId])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    const handleSave = async () => {
        try {
            const updated = await updateService(serviceId, formData)
            setService(updated)
            setIsEditing(false)
            alert('Service updated successfully!')
        } catch (error) {
            alert('Failed to update service.')
        }
    }
    
    const handleToggleStatus = () => {
        if (window.confirm(`Are you sure you want to set this service to ${service.is_active ? 'Inactive' : 'Active'}?`)) {
            const updatedService = { ...service, is_active: !service.is_active }
            setService(updatedService)
            setFormData(updatedService)
            alert('Status updated!')
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
            console.log('Deleting service', serviceId)
            alert('Service deleted.')
            navigate('/services')
        }
    }

    const statusInfo = useMemo(() => service ? getStatusBadge(service.is_active) : {}, [service])

    if (loading) return <div className="p-6 text-center">Loading service details...</div>
    if (!service) return <div className="p-6 text-center text-red-600">Service not found.</div>

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">

            <div>
                <Link to="/services" className="flex items-center gap-2 text-sm text-[#545F71] hover:text-[#495057] mb-4">
                    <ArrowLeft size={16} /> Back to Services
                </Link>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[#495057]">{service.name}</h1>
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                                <XCircle size={16} /> Cancel
                            </button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                             <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                                <Trash2 size={18} />
                            </button>
                            <button onClick={handleToggleStatus} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
                                {service.is_active ? <ToggleRight size={20} className="text-green-500"/> : <ToggleLeft size={20} />}
                                {service.is_active ? 'Set to Inactive' : 'Set to Active'}
                            </button>
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]">
                                <Edit size={16} /> Edit Service
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-6">
                
                <div>
                    <h2 className="text-lg font-semibold text-[#495057] mb-4">Service Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="text-sm font-medium text-[#495057]">Service Name</label>
                            {isEditing ? (
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full mt-1 p-2 border border-[#E9ECEF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#545F71]" />
                            ) : (
                                <p className="mt-1 text-base text-[#495057]">{service.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-[#495057]">Category</label>
                            {isEditing ? (
                                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full mt-1 p-2 border border-[#E9ECEF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white capitalize">
                                    {serviceCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            ) : (
                                <p className="mt-1 text-base text-[#495057] capitalize">{service.category}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                             <label className="text-sm font-medium text-[#495057]">Description</label>
                            {isEditing ? (
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full mt-1 p-2 border border-[#E9ECEF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#545F71]"></textarea>
                            ) : (
                                <p className="mt-1 text-base text-[#495057]">{service.description || 'No description available.'}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-[#495057]">Status</label>
                            <p className="mt-1">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.className}`}>
                                    {statusInfo.label}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#E9ECEF]"></div>

                <div>
                    <h2 className="text-lg font-semibold text-[#495057] mb-4">Pricing & Capacity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-[#495057]">Base Price</label>
                            {isEditing ? (
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rp</span>
                                    <input type="number" name="base_price" value={formData.base_price} onChange={handleInputChange} className="w-full p-2 pl-8 border border-[#E9ECEF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#545F71]" />
                                </div>
                            ) : (
                                <p className="mt-1 text-base text-[#495057]">{formatCurrencyIDR(service.base_price)}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-[#495057]">Capacity per Day</label>
                            {isEditing ? (
                                <input type="number" name="capacity_per_day" value={formData.capacity_per_day} onChange={handleInputChange} className="w-full mt-1 p-2 border border-[#E9ECEF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#545F71]" />
                            ) : (
                                <p className="mt-1 text-base text-[#495057]">{service.capacity_per_day} slots</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ServiceDetailPage