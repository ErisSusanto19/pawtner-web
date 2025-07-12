import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ArrowLeft, Edit, Archive, Trash2 } from 'lucide-react';
import { formatCurrencyIDR } from '../../../utils/formatter'
import { fetchServiceById, setCurrentService, deleteExistingService, updateExistingService } from '../../../store/slices/serviceSlice';
import Button from '../../../components/Button';
import ConfirmationModal from '../../../components/ConfirmationModal';
import ServiceModal from './ServiceModal';
import defImg from '@/assets/undraw_images_of1m.svg'
import ServiceReviews from './ServiceReviews';

const formatCategory = (category = '') => {
    return category.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

const ServiceDetailPage = () => {
    const { serviceId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { currentItem: service, status, error } = useSelector(state => state.services)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

    useEffect(() => {
        dispatch(fetchServiceById(serviceId))
        return () => {
            dispatch(setCurrentService(null))
        }
    }, [serviceId, dispatch]);

    useEffect(() => {
        if (status === 'failed' && service) {
            toast.error(`Failed to refresh service data: ${error}`)
        }
    }, [status, error, service])

    const handleArchive = () => {
        setIsConfirmModalOpen(true)
    }

    const confirmArchive = async () => {
        if (!service) return
        try {
            const response = await dispatch(deleteExistingService(service.id));
            toast.success(response.data?.message || `Service "${service.name}" removed successfully!`);
            navigate('/services')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove service.')
        } finally {
            setIsConfirmModalOpen(false)
        }
    }

    const handleUpdateService = async (updatedData) => {
        if (!service) return
        try {
            const response = await dispatch(updateExistingService({ serviceId: service.id, serviceData: updatedData }));
            toast.success(response.data?.message || 'Service updated successfully!')
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update service.')
        }
    }
    
    if (status === 'loading' && !service) return <div className="p-6 text-center">Loading service details...</div>;
    
    if (status === 'failed' && !service) {
        return (
            <div className="p-6 text-center text-red-600">
                <h2 className="text-xl font-bold mb-2">Failed to Load Service</h2>
                <p className="mb-4">{error}</p>
                <Link to="/services" className="text-[#545F71] hover:underline inline-flex items-center gap-2">
                    <ArrowLeft size={16} />
                    Back to all services
                </Link>
            </div>
        );
    }
    
    if (!service) return null

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div>
                <Link to="/services" className="flex items-center gap-2 text-sm text-[#545F71] hover:text-blue-600 mb-4">
                    <ArrowLeft size={16} /> Back to Services
                </Link>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[#495057]">{service.name}</h1>
                    <div className="flex gap-2">
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Edit size={16} /> Edit
                        </Button>
                        <Button onClick={handleArchive} danger>
                            <Trash2 size={16} /> Delete
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <img 
                        src={service.imageUrl || defImg} 
                        alt={service.name} 
                        className="w-full h-auto rounded-lg object-cover"
                        onError={(e) => {
                            e.target.onerror = null
                            e.target.src = defImg
                        }}
                    />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <h3 className="text-xs text-gray-500 uppercase font-semibold">Description</h3>
                        <p className="text-gray-800 mt-1 whitespace-pre-wrap">{service.description || 'No description provided.'}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t pt-4">
                        <div>
                            <h3 className="text-xs text-gray-500 uppercase font-semibold">Base Price</h3>
                            <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrencyIDR(service.basePrice)}</p>
                        </div>
                        <div>
                            <h3 className="text-xs text-gray-500 uppercase font-semibold">Category</h3>
                            <p className="text-gray-800 mt-1">{formatCategory(service.category)}</p>
                        </div>
                        <div>
                            <h3 className="text-xs text-gray-500 uppercase font-semibold">Capacity/Day</h3>
                            <p className="text-lg font-bold text-gray-900 mt-1">{service.capacityPerDay ?? 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <ServiceReviews
                reviews={service.reviews}
                averageRating={service.averageRating}
                reviewCount={service.reviewCount}
            />

            <ServiceModal 
                isOpen={isModalOpen}
                service={service}
                onClose={() => setIsModalOpen(false)}
                onSave={handleUpdateService}
                isLoading={status === 'loading'}
            />

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmArchive}
                title="Confirm Archival"
                message={`Are you sure you want to archive the service "${service?.name}"?`}
            />
        </div>
    )
}

export default ServiceDetailPage