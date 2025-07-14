import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Edit, Stethoscope, FileText, Trash2, AlertCircle } from 'lucide-react';
import BookingModal from './BookingModal';
import CreatePrescriptionModal from './CreatePrescriptionModal';

import { fetchBookingById, changeBookingStatus, clearCurrentBooking } from '../../../store/slices/bookingSlice';
import { fetchPrescriptionsByBooking, createNewPrescription, deleteExistingPrescription, clearPrescriptions } from '../../../store/slices/prescriptionSlice';
import { formatCurrencyIDR } from '../../../utils/formatter';
import PageLoader from '../../../components/PageLoader';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../components/ConfirmationModal';

const getStatusBadge = (status) => {
    switch (status) {
        case 'CONFIRMED': return "bg-green-100 text-green-800";
        case 'COMPLETED': return "bg-blue-100 text-blue-800";
        case 'AWAITING_PAYMENT': return "bg-orange-100 text-orange-800";
        case 'REQUESTED':
        // case 'PENDING_APPROVAL': return "bg-yellow-100 text-yellow-800";
        case 'CANCELLED': return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
    }
}

const formatStatusText = (status) => (status || '').replace(/_/g, ' ').toLowerCase();

const PrescriptionCard = ({ prescription, onDelete }) => (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 relative">
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-200">
            <div>
                <p className="text-sm uppercase font-semibold text-gray-500 tracking-wider">Prescription Issued</p>
                <p className="text-base font-semibold text-gray-700">{format(parseISO(prescription.issueDate), 'MMMM d, yyyy')}</p>
            </div>
            <button
                onClick={() => onDelete(prescription.id)}
                className="p-1.5 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                title="Delete Prescription"
            >
                <Trash2 size={16} />
            </button>
        </div>

        {prescription.notes && (
            <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-700 mb-1">General Notes</h4>
                <p className="text-sm text-gray-800 whitespace-pre-wrap bg-white border p-3 rounded-md">{prescription.notes}</p>
            </div>
        )}

        <div>
            <h4 className="text-base font-semibold text-gray-700 mb-2">Medications</h4>
            <div className="space-y-3">
                {prescription.prescriptionItems.map(item => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3">
                        {/* Nama Obat Paling Menonjol */}
                        <p className="font-bold text-base text-blue-600 mb-2">{item.medicationName}</p>
                        
                        {/* Detail Obat dalam Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Dosage</p>
                                <p className="text-gray-800">{item.dosage}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Frequency</p>
                                <p className="text-gray-800">{item.frequency}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Duration</p>
                                <p className="text-gray-800">{item.durationDays} day(s)</p>
                            </div>
                        </div>

                        {/* Instruksi Khusus */}
                        {item.instructions && (
                            <div className="mt-3 pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500 font-medium">Instructions</p>
                                <p className="text-sm text-gray-800">{item.instructions}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const BookingDetailPage = () => {
    const { bookingId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [prescriptionToDelete, setPrescriptionToDelete] = useState(null)

    const { currentBooking: booking, status: bookingStatus, error: bookingError } = useSelector((state) => state.bookings);
    const { items: prescriptions, status: prescriptionStatus, error: prescriptionError } = useSelector(state => state.prescriptions);

    useEffect(() => {
        if (bookingId) {
            dispatch(fetchBookingById(bookingId));
            dispatch(fetchPrescriptionsByBooking(bookingId));
        }

        return () => {
            dispatch(clearCurrentBooking());
            dispatch(clearPrescriptions());
        };
    }, [bookingId, dispatch])

    useEffect(() => {
        if (bookingStatus === 'failed' && bookingError) {
            toast.error(`Failed to load booking details: ${bookingError}`)
        }
        
        if (prescriptionStatus === 'failed' && prescriptionError) {
             toast.error(`Failed to load prescriptions: ${prescriptionError}`)
        }

    }, [bookingStatus, bookingError, prescriptionStatus, prescriptionError])

    const handleStatusUpdate = async (newStatus) => {
        try {
            await dispatch(changeBookingStatus({ bookingId, status: newStatus }))
            setIsStatusModalOpen(false)
            toast.success("Status has been updated.")
        } catch (err) {
            console.error("Failed to update status:", err);
            toast.error(err.message)
        }
    };
    
    const handlePrescriptionCreate = async (formData) => {
        if (!booking || !booking.pet || !booking.businessId) {
            toast.error("Booking data is incomplete.");
            return;
        }
        const payload = {
            ...formData,
            petId: booking.pet.id,
            issuingBusinessId: booking.businessId,
            bookingId: booking.id,
            issueDate: new Date().toISOString().split('T')[0],
        };
        
        try {
            await dispatch(createNewPrescription(payload));
            setIsPrescriptionModalOpen(false);
            toast.success("Prescription has been created")
        } catch (error) {
            const message = error.response?.data?.message || error.message
            toast.error(`Failed to create prescription: ${message}`)
            console.error(error)
        }
    }

    const handleDeletePrescription = (prescriptionId) => {
        setPrescriptionToDelete(prescriptionId)
        setIsDeleteModalOpen(true)
    }

    const confirmDeletePrescription = async () => {
        if (prescriptionToDelete) {
            try {
                await dispatch(deleteExistingPrescription(prescriptionToDelete))
                toast.success("Prescription has been deleted.")
            } catch (error) {
                toast.error("Failed to delete prescription.")
                console.error(error)
            } finally {
                setIsDeleteModalOpen(false)
                setPrescriptionToDelete(null)
            }
        }
    }

    if (bookingStatus === 'loading' && !booking) {
        return <PageLoader message="Loading booking details..."/>
    }

    if (bookingStatus === 'failed' && !booking) {
        return (
            <div className="p-6 text-center text-red-500">
                <h2>Error: {bookingError}</h2>
                <Link to="/bookings" className="text-[#545F71] hover:underline mt-4 inline-block">
                    Back to all bookings
                </Link>
            </div>
        );
    }

    if (!booking) {
        return <div className="p-6 text-center">Booking not found.</div>;
    }
    
    const isVeterinaryService = booking.service?.category.toLowerCase() === 'veterinary' || booking.service?.category.toLowerCase() === 'hybrid'

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[#545F71] hover:text-[#5D6D7E] mb-4">
                    <ArrowLeft size={16} /> Back
                </button>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                    <h1 className="text-2xl font-bold text-[#495057]">
                        Booking <span className="text-[#ADB5BD]">#{booking.bookingNumber}</span>
                    </h1>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsStatusModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]">
                            <Edit size={16} /> Update Status
                        </button>
                        {isVeterinaryService && booking.status === 'COMPLETED' && prescriptions.length === 0 && (
                            <button
                                onClick={() => setIsPrescriptionModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]">
                                <Stethoscope size={16} /> Create Prescription
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-[#495057]">Booking Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <div className="flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Service</span><span className="font-medium text-[#495057] mt-1">{booking.service?.name}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Category</span><span className="font-medium text-[#495057] mt-1">{booking.service?.category}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Date & Time</span><span className="font-medium text-[#495057] mt-1">{format(parseISO(booking.startTime), 'EEEE, MMMM d, yyyy')} at {format(parseISO(booking.startTime), 'HH:mm')}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Total Price</span><span className="font-medium text-[#495057] mt-1">{formatCurrencyIDR(booking.totalPrice)}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Status</span><span className={`px-2 py-1 text-xs font-medium rounded-full self-start mt-1 capitalize ${getStatusBadge(booking.status)}`}>{formatStatusText(booking.status)}</span></div>
                        {booking.specialInstructions && (
                            <div className="md:col-span-2 flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Special Instructions</span><p className="font-medium text-[#495057] mt-1 whitespace-pre-wrap">{booking.specialInstructions}</p></div>
                        )}
                    </div>
                </div>
                <div className="space-y-6">
                     <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                         <h3 className="text-lg font-semibold text-[#495057] mb-4">Customer Information</h3>
                         <div className="space-y-1 text-sm">
                            <p className="font-medium text-[#495057]">{booking.customer?.name}</p>
                            <p className="text-[#5D6D7E]">{booking.customer?.email}</p>
                            <p className="text-[#5D6D7E]">{booking.customer?.phone}</p>
                         </div>
                     </div>
                     <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                         <h3 className="text-lg font-semibold text-[#495057] mb-4">Pet Information</h3>
                         <div className="space-y-1 text-sm">
                             <p className="font-medium text-[#495057]">{booking.pet?.name}</p>
                             <p className="text-[#5D6D7E]">{booking.pet?.breed} - {booking.pet?.species}</p>
                         </div>
                     </div>
                </div>
            </div>

            {isVeterinaryService && (
                <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                    <h3 className="text-lg font-semibold text-[#495057] mb-4 flex items-center gap-2"><FileText size={20}/> Prescription History</h3>
                    {prescriptionStatus === 'loading' && <p className="text-sm text-center text-gray-500 py-6">Loading prescriptions...</p>}
                    {prescriptionStatus === 'failed' && <p className="text-sm text-center text-red-500 py-6">Error loading prescriptions: {prescriptionError}</p>}
                    {prescriptionStatus === 'succeeded' && (
                        prescriptions.length > 0 ? (
                            <div className="space-y-4">
                                {prescriptions.map(p => (
                                    <PrescriptionCard key={p.id} prescription={p} onDelete={handleDeletePrescription} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-center text-[#ADB5BD] py-6">No prescription has been issued for this booking yet.</p>
                        )
                    )}
                </div>
            )}
            
            <BookingModal 
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                currentStatus={booking.status}
                onUpdate={handleStatusUpdate}
            />

             <CreatePrescriptionModal
                isOpen={isPrescriptionModalOpen}
                onClose={() => setIsPrescriptionModalOpen(false)}
                onSave={handlePrescriptionCreate}
                petName={booking.pet?.name}
                isLoading={prescriptionStatus === 'loading'}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeletePrescription}
                title="Delete Prescription"
                message="Are you sure you want to delete this prescription? This action cannot be undone."
                isLoading={prescriptionStatus === 'loading'}
            />
        </div>
    )
}

export default BookingDetailPage