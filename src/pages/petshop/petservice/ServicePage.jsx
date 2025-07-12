import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Archive, Search, Trash2,  ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ServiceModal from './ServiceModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Button from '../../../components/Button';
import Pagination from '../../../components/Pagination';
import { formatCurrencyIDR } from '../../../utils/formatter';
import { fetchServices, deleteExistingService, updateExistingService, createNewService } from '../../../store/slices/serviceSlice';
import defImg from '@/assets/undraw_images_of1m.svg'
import StarRating from '../../../components/StarRating';
import PageLoader from '../../../components/PageLoader';

const getStatusBadge = (isActive) => {
    return isActive
        ? "bg-green-100 text-green-800"
        : "bg-gray-200 text-gray-800";
}

const categoryOptions = [
    { value: 'GROOMING', label: 'Grooming' },
    { value: 'BOARDING', label: 'Boarding' },
    { value: 'VETERINARY', label: 'Veterinary' },
    { value: 'DAYCARE', label: 'Daycare' },
]

const formatCategory = (category = '') => {
    return category.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

const ServicePage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const { items: services, status, error } = useSelector(state => state.services)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedService, setSelectedService] = useState(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 5

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [isConfirmLoading, setIsConfirmLoading] = useState(false)
    const [serviceToAction, setServiceToAction] = useState(null);
    const [confirmAction, setConfirmAction] = useState({ fn: null, title: '', message: '' })

    useEffect(() => {
        dispatch(fetchServices({page: 0, size: 50}))
    }, [dispatch, location])

    useEffect(() => {
        if (status === 'failed' && services.length > 0) {
            toast.error(`Failed to refresh services: ${error}`)
        }
    }, [status, error, services.length])

    const filteredAndSortedServices = useMemo(() => {
        let serviceList = Array.isArray(services) ? services : []
        serviceList = serviceList.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory

            return matchesSearch && matchesCategory
        })

        if(sortConfig.key !== null){
            serviceList.sort((a, b) => {
                const valA = a[sortConfig.key] ?? 0;
                const valB = b[sortConfig.key] ?? 0;
                
                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            })
        }

        return serviceList
    }, [services, searchTerm, selectedCategory, sortConfig])


    const paginatedServices = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredAndSortedServices.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredAndSortedServices, currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronsUpDown size={14} className="ml-2 text-gray-400" />;
        }
        return sortConfig.direction === 'ascending' ? 
            <ArrowUp size={14} className="ml-2 text-blue-600" /> : 
            <ArrowDown size={14} className="ml-2 text-blue-600" />;
    };

    const handleCreateService = async (newData) => {
        try {
            const response = await dispatch(createNewService(newData))
            toast.success(response.message || "Service created successfully!")
            setIsModalOpen(false)
        } catch (err) {
            toast.error(err.message || `Failed to create service.`)
        }
    }

    const handleUpdateService = async (updatedData) => {
        if (!selectedService) return
        try {
            const response = await dispatch(updateExistingService({ serviceId: selectedService.id, serviceData: updatedData }))
            toast.success(response.message || "Service updated successfully!")
            setIsModalOpen(false)
        } catch (err) {
            toast.error(err.message || `Failed to update service.`)
        }
    }

    const handleAddNew = () => {
        setSelectedService(null)
        setIsModalOpen(true)
    }

    const handleEdit = (service) => {
        setSelectedService(service)
        setIsModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!serviceToAction) return

        setIsConfirmLoading(true)
        try {
            const response = await dispatch(deleteExistingService(serviceToAction.id))
            toast.success(response.message || `Service "${serviceToAction.name}" has been removed.`)
            setIsConfirmModalOpen(false)
        } catch (err) {
            toast.error(err.message || `Failed to delete service.`)
        } finally {
            setIsConfirmLoading(false)
        }
    }

    const handleDeleteClick = (service) => {
        setServiceToAction(service)
        setConfirmAction({
            fn: () => handleConfirmDelete(service),
            title: "Confirm Archival",
            message: `Are you sure you want to delete the service "${service.name}"? This action will make it inactive.`
        })
        setIsConfirmModalOpen(true)
    }

    if (status === 'loading' && (!services || services.length === 0)) {
        return <PageLoader message="Loading services..."/>
    }

    if (status === 'failed' && error) {
        return <div className="p-6 text-center text-red-600">{error}</div>
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#495057]">Service Management</h1>
                <Button onClick={handleAddNew}>
                    <PlusCircle size={16} />
                    <span className="ml-2">Add New Service</span>
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
                        <input type="text" placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-[#E9ECEF] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]" />
                    </div>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white">
                        <option value="All">All Categories</option>
                        {categoryOptions.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F8F9FA] text-left text-[#495057]">
                            <tr>
                                <th className="py-3 px-4 font-semibold text-center">#</th>
                                <th className="py-3 px-4 font-semibold">Service</th>
                                <th className="py-3 px-4 font-semibold">Category</th>
                                <th className="py-3 px-4 font-semibold cursor-pointer hover:bg-gray-200" onClick={() => requestSort('basePrice')}>
                                    <div className="flex items-center">Base Price {getSortIcon('basePrice')}</div>
                                </th>
                                <th className="py-3 px-4 font-semibold">Capacity/Day</th>
                                <th className="py-3 px-4 font-semibold cursor-pointer hover:bg-gray-200" onClick={() => requestSort('averageRating')}>
                                    <div className="flex items-center">Rating {getSortIcon('averageRating')}</div>
                                </th>
                                <th className="py-3 px-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedServices.map((service, index) => (
                                <tr key={service.id} onClick={() => navigate(`/services/${service.id}`)} className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA] cursor-pointer">
                                    <td className="py-3 px-4 text-center text-[#495057]">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            {/* {service.imageUrl ? 
                                                <img src={service.imageUrl} alt={service.name} className="w-10 h-10 rounded-md object-cover mr-4" /> :
                                                <div className="w-10 h-10 rounded-md bg-gray-200 mr-4 flex-shrink-0"></div>
                                            } */}
                                            <img src={service.imageUrl || defImg} 
                                                alt={service.name} 
                                                className="w-10 h-10 rounded-md object-cover mr-4"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = defImg;
                                                }}
                                            />
                                            <div>
                                                <p className="font-medium text-[#545F71]">{service.name}</p>
                                                <p className="text-xs text-[#ADB5BD] truncate max-w-50">{service.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-[#495057]">{formatCategory(service.category)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{formatCurrencyIDR(service.basePrice)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{service.capacityPerDay ?? 'N/A'}</td>
                                    {/* <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(service.isActive)}`}>
                                            {service.isActive ? 'Active' : 'Archived'}
                                        </span>
                                    </td> */}
                                    <td className="py-3 px-4">
                                        {service.reviewCount > 0 ? (
                                            <div className="flex items-center gap-1.5">
                                                <StarRating rating={service.averageRating} size={16} />
                                                <span className="text-xs text-gray-500 mt-0.5">({service.reviewCount})</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <Button buttonType="button" onClick={(e) => { e.stopPropagation(); handleEdit(service); }} title="Edit Service">
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                buttonType="button"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(service); }}
                                                danger={true}
                                                title="Delete Service"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredAndSortedServices.length === 0 && (
                        <div className="text-center py-10 text-[#495057]"><p>No services found matching your criteria.</p></div>
                    )}
                </div>
            </div>

            <div className="mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredAndSortedServices.length / ITEMS_PER_PAGE)}
                    onPageChange={handlePageChange}
                />
            </div>
            
            {isModalOpen && (
              <ServiceModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  service={selectedService}
                  onSave={selectedService ? handleUpdateService : handleCreateService}
                  isLoading={status === 'loading'}
              />
            )}
            
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => !isConfirmLoading && setIsConfirmModalOpen(false)}
                onConfirm={confirmAction.fn}
                title={confirmAction.title}
                message={confirmAction.message}
                isLoading={isConfirmLoading}
            />
        </div>
    )
}

export default ServicePage