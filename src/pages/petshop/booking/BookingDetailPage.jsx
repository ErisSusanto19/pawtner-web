// src/pages/BookingDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Edit, Stethoscope, FileText } from 'lucide-react';
import BookingModal from './BookingModal';
import CreatePrescriptionModal from './CreatePrescriptionModal';

import { fetchBookingById, changeBookingStatus, clearCurrentBooking } from '../../../store/slices/bookingSlice';
import { createNewPrescription } from '../../../store/slices/prescriptionSlice';

const getStatusBadge = (status) => {
    switch (status) {
        case 'CONFIRMED': return "bg-green-100 text-green-800"
        case 'COMPLETED': return "bg-blue-100 text-blue-800"
        case 'AWAITING_PAYMENT': return "bg-orange-100 text-orange-800"
        case 'REQUESTED':
        case 'PENDING_APPROVAL': return "bg-yellow-100 text-yellow-800"
        case 'CANCELLED': return "bg-red-100 text-red-800"
        default: return "bg-gray-100 text-gray-800"
    }
}

const BookingDetailPage = () => {
    const { bookingId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { currentBooking: booking, status, error } = useSelector((state) => state.bookings)
    const { status: prescriptionStatus } = useSelector(state => state.prescriptions)

    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
    

    useEffect(() => {
        if (bookingId) {
            dispatch(fetchBookingById(bookingId))
        }

        return () => {
            dispatch(clearCurrentBooking())
        }
    }, [bookingId, dispatch])

    const handleStatusUpdate = async (newStatus) => {
        try {
            await dispatch(changeBookingStatus({ bookingId, status: newStatus }))
            setIsStatusModalOpen(false)
        } catch (err) {
            console.error("Failed to update status:", err)
            alert(`Error: ${err.message}`)
        }
    }
    
    const handlePrescriptionCreate = async (formData) => {
        if (!booking || !booking.pet || !booking.businessId) {
            alert("Booking data is incomplete.")
            return
        }

        const payload = {
            ...formData,
            petId: booking.pet.id,
            issuingBusinessId: booking.businessId,
            issueDate: new Date().toISOString().split('T')[0],
        }
        
        try {
            await dispatch(createNewPrescription(payload)).unwrap()
            setIsPrescriptionModalOpen(false);
        } catch (error) {
            console.error(error)
        }
    }

    if (status === 'loading' && !booking) {
        return <div className="p-6 text-center">Loading booking details...</div>
    }

    if (status === 'failed' && !booking) {
        return (
            <div className="p-6 text-center text-red-500">
                <h2>Error: {error}</h2>
                <Link to="/bookings" className="text-[#545F71] hover:underline mt-4 inline-block">
                    Back to all bookings
                </Link>
            </div>
        )
    }

    if (!booking) {
        return <div className="p-6 text-center">Booking not found.</div>;
    }
    
    const formatStatusText = (status) => (status || '').replace(/_/g, ' ').toLowerCase()
    const isVeterinaryService = booking.service?.category.toLowerCase() == 'veterinary'

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div>
                <Link to="/bookings" className="flex items-center gap-2 text-sm text-[#545F71] hover:text-[#5D6D7E] mb-4">
                    <ArrowLeft size={16} /> Back to Bookings
                </Link>
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
                        {isVeterinaryService && booking.status === 'COMPLETED' && (
                            <button
                                onClick={() => setIsPrescriptionModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
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
                        <div className="flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Date & Time</span><span className="font-medium text-[#495057] mt-1">{format(parseISO(booking.startTime), 'EEEE, MMMM d, yyyy')} from {format(parseISO(booking.startTime), 'HH:mm')} to {format(parseISO(booking.endTime), 'HH:mm')}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Total Price</span><span className="font-medium text-[#495057] mt-1">${(booking.totalPrice || 0).toFixed(2)}</span></div>
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
                             <p className="text-[#5D6D7E]">{booking.pet?.breed}</p>
                         </div>
                     </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <h3 className="text-lg font-semibold text-[#495057] mb-4 flex items-center gap-2"><FileText size={20}/> Prescription History</h3>
                <p className="text-sm text-center text-[#ADB5BD] py-6">No prescription has been issued for this booking yet.</p>
            </div>
            
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
        </div>
    )
}

export default BookingDetailPage