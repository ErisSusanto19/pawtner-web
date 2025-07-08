import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    ArrowLeft, CheckCircle, XCircle, Clock, ShieldCheck,
    Briefcase, Mail, Phone, MapPin, Globe, AlertTriangle, AlertCircle
} from 'lucide-react';
import defImg from '@/assets/undraw_images_of1m.svg'

import ConfirmationModal from '../../../components/ConfirmationModal';
import {
    fetchBusinessById,
    approveOrRejectBusiness,
    clearSelectedBusiness
} from '../../../store/slices/businessManagementSlice';

const StatusBadge = ({ status }) => {
    if (status == 'Approved') {
        return <span className="flex items-center gap-1.5 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full"><ShieldCheck size={16}/> Approved</span>;
    } else if(status == 'Rejected'){
        return <span className="flex items-center gap-1.5 text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full"><AlertCircle size={16}/> Rejected</span>;
    }
    return <span className="flex items-center gap-1.5 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full"><Clock size={16}/> Pending</span>;
};

const BusinessProfileCard = ({ business }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <img 
                src={business.businessImageUrl || defImg}
                alt={business.businessName} 
                className="w-28 h-28 rounded-lg object-cover ring-4 ring-gray-200 flex-shrink-0" 
                onError={(e) => {
                    e.target.onerror = null,
                    e.target.src = defImg
                }}
            />
            <div className="text-center sm:text-left flex-grow">
                <StatusBadge status={business.statusApproved} />
                <h2 className="text-2xl font-bold text-gray-800 mt-3">{business.businessName}</h2>
                <p className="text-md text-gray-500">{business.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-600"><Briefcase size={14} /> Owner: <span className="font-medium text-gray-800">{business.ownerName}</span></p>
                    <p className="flex items-center gap-2 text-gray-600"><Mail size={14} /> {business.businessEmail}</p>
                    <p className="flex items-center gap-2 text-gray-600"><Phone size={14} /> {business.businessPhone}</p>
                </div>
            </div>
        </div>
    </div>
);

const BusinessDetailsCard = ({ business }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Additional Details</h3>
        <div className="space-y-4 text-sm">
            <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Business Type:</span>
                <span className="text-gray-800">{business.businessType.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between items-start">
                <span className="font-semibold text-gray-600">Address:</span>
                <span className="text-gray-800 text-right max-w-xs">{business.businessAddress}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Emergency Services:</span>
                <span className={`font-medium ${business.hasEmergencyServices ? 'text-green-600' : 'text-red-600'}`}>
                    {business.hasEmergencyServices ? 'Available' : 'Not Available'}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Coordinates (Lat, Lng):</span>
                <span className="text-gray-800 font-mono text-xs">{`${business.latitude}, ${business.longitude}`}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Certificate:</span>
                <a href={business.certificateImageUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                    View Certificate <Globe size={14} />
                </a>
            </div>
        </div>
    </div>
);

const AdminActionsCard = ({ business, onAction }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Admin Actions</h3>

        {business.statusApproved === 'Pending' && (
            <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">This business is awaiting approval.</p>
                <button 
                    onClick={() => onAction(business.businessId, true, 'approve')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                    <CheckCircle size={16} /> Approve Business
                </button>
                <button 
                    onClick={() => onAction(business.businessId, false, 'reject')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                    <XCircle size={16} /> Reject Business
                </button>
                <p className="text-xs text-gray-500 mt-2">
                    Approving makes the business public. Rejecting keeps it hidden (status remains pending).
                </p>
            </div>
        )}

        {business.statusApproved === 'Approved' && (
            <div className="space-y-4">
                 <p className="text-sm font-semibold text-gray-700">This business is currently approved.</p>
                <button 
                    onClick={() => onAction(business.businessId, null, 'revoke')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
                >
                    <AlertTriangle size={16} /> Revoke Approval
                </button>
                <p className="text-xs text-gray-500 mt-2">
                    Revoking approval will set the business back to 'Pending' and hide it from the public.
                </p>
            </div>
        )}

        {business.statusApproved === 'Rejected' && (
            <div className="space-y-4">
                 <p className="text-sm font-semibold text-gray-700">This business is currently rejected.</p>
                <button 
                    onClick={() => onAction(business.businessId, null, 'revoke')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
                >
                    <AlertTriangle size={16} /> Revoke Rejection
                </button>
                <p className="text-xs text-gray-500 mt-2">
                    Revoking rejection will set the business back to 'Pending' and hide it from the public.
                </p>
            </div>
        )}
    </div>
);


const BusinessDetailPage = () => {
    const { businessId } = useParams()
    const dispatch = useDispatch();

    const { 
        selectedBusiness: business,
        isLoading,
        error 
    } = useSelector((state) => state.businessManagement);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (businessId) {
            dispatch(fetchBusinessById(businessId));
        }
        return () => {
            dispatch(clearSelectedBusiness());
        };
    }, [dispatch, businessId]);
    
    const handleAdminAction = (id, isApproved, verb) => {
        setConfirmationData({
            title: `Confirm ${verb.charAt(0).toUpperCase() + verb.slice(1)}`,
            message: `Are you sure you want to ${verb} this business? This action may affect its visibility to users.`,
            onConfirm: () => handleConfirmAction(id, isApproved, verb),
        });
        setIsModalOpen(true);
    };

    const handleConfirmAction = async (id, isApproved, verb) => {
        setIsSubmitting(true);
        try {
            await dispatch(approveOrRejectBusiness(id, isApproved))
            toast.success(`Business has been successfully ${verb}${verb.endsWith('e') ? 'd' : 'ed'}.`);
        } catch (err) {
            toast.error(err.message || `Failed to ${verb} business.`);
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

    if (isLoading && !business) {
        return <div className="text-center p-8">Loading business details...</div>;
    }

    if (error) {
        return (
            <div className="text-center p-8 text-red-500">
                <p>Error: {error}</p>
                <Link to="/admin/businesses" className="text-indigo-600 hover:underline mt-4 inline-block">Go back to list</Link>
            </div>
        );
    }

    if (!business) {
        return <div className="text-center p-8">Business not found.</div>;
    }

    return (
        <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
            <div>
                <Link to="/admin/businesses" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft size={16} />
                    Back to Business List
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Business Details</h1>
            </div>
      
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <BusinessProfileCard business={business} />
                    <BusinessDetailsCard business={business} />
                </div>
                <div className="lg:col-span-1">
                    <AdminActionsCard business={business} onAction={handleAdminAction} />
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
};

export default BusinessDetailPage