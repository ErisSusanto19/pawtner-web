import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, startOfToday } from 'date-fns';
import { ArrowLeft, Edit, Stethoscope, FileText } from 'lucide-react';
import BookingModal from './BookingModal';
import CreatePrescriptionModal from './CreatePrescriptionModal';

const today = startOfToday()

const dummyBookings = [
    {
        id: 1,
        booking_number: 'BK-20231027-001',
        customer: { id: 'cust_01', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '555-0101' },
        pet: { id: 'pet_01', name: 'Max', type: 'Golden Retriever' },
        service: { id: 'svc_01', name: 'Premium Full Grooming', category: 'grooming' },
        start_time: new Date(new Date(today).setHours(9, 0, 0)),
        end_time: new Date(new Date(today).setHours(10, 30, 0)),
        total_price: 55.00,
        status: 'confirmed'
    },
    {
        id: 2,
        booking_number: 'BK-20231027-002',
        customer: { id: 'cust_02', name: 'Mike Chen', email: 'mike.chen@example.com', phone: '555-0102' },
        pet: { id: 'pet_02', name: 'Whiskers', type: 'Persian Cat' },
        service: { id: 'svc_06', name: 'General Health Check-up', category: 'veterinary' },
        start_time: new Date(new Date(today).setHours(10, 30, 0)),
        end_time: new Date(new Date(today).setHours(11, 0, 0)),
        total_price: 60.00,
        status: 'completed'
    },
    {
        id: 3,
        booking_number: 'BK-20231027-003',
        customer: { id: 'cust_03', name: 'Emily Davis', email: 'em.davis@example.com', phone: '555-0103' },
        pet: { id: 'pet_03', name: 'Rocky', type: 'Border Collie' },
        service: { id: 'svc_04', name: 'Full Day Playtime', category: 'daycare' },
        start_time: new Date(new Date(today).setHours(12, 0, 0)),
        end_time: new Date(new Date(today).setHours(17, 0, 0)),
        total_price: 25.00,
        status: 'requested'
    },
    {
        id: 4,
        booking_number: 'BK-20231027-004',
        customer: { id: 'cust_04', name: 'Robert Wilson', email: 'rob.wilson@example.com', phone: '555-0104' },
        pet: { id: 'pet_04', name: 'Fifi', type: 'Poodle' },
        service: { id: 'svc_05', name: 'Basic Bath & Brush', category: 'grooming' },
        start_time: new Date(new Date(today).setHours(14, 0, 0)),
        end_time: new Date(new Date(today).setHours(15, 0, 0)),
        total_price: 30.00,
        status: 'awaiting_payment'
    },
    {
        id: 5,
        booking_number: 'BK-20231028-001', // Booking untuk besok
        customer: { id: 'cust_01', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '555-0101' },
        pet: { id: 'pet_01', name: 'Max', type: 'Golden Retriever' },
        service: { id: 'svc_02', name: 'Luxury Pet Suite (per day)', category: 'boarding' },
        start_time: new Date(new Date().setDate(today.getDate() + 1)).setHours(11, 0, 0),
        end_time: new Date(new Date().setDate(today.getDate() + 3)).setHours(11, 0, 0),
        total_price: 70.00,
        status: 'confirmed'
    },
]

const getStatusBadge = (status) => {
    switch (status) {
        case 'confirmed': return "bg-green-100 text-green-800"
        case 'completed': return "bg-blue-100 text-blue-800"
        case 'awaiting_payment': return "bg-orange-100 text-orange-800"
        case 'requested':
        case 'pending_approval': return "bg-yellow-100 text-yellow-800"
        case 'cancelled': return "bg-red-100 text-red-800"
        default: return "bg-gray-100 text-gray-800"
    }
}

const BookingDetailPage = () => {
    const { bookingId } = useParams()

    const [booking, setBooking] = useState(dummyBookings.find(b => b.id.toString() === bookingId))
    
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)

    if (!booking) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl text-[#495057]">Booking not found.</h2>
                <Link to="/bookings" className="text-[#545F71] hover:underline mt-4 inline-block">
                    Back to all bookings
                </Link>
            </div>
        )
    }

    const handleStatusUpdate = (newStatus) => {
        console.log(`Updating booking ${booking.id} to ${newStatus}`)
        setBooking(prev => ({ ...prev, status: newStatus }))
        setIsStatusModalOpen(false)
    };

    const handlePrescriptionCreate = (prescriptionData) => {
        console.log("Creating new prescription for booking:", booking.id, prescriptionData)
        alert("Prescription created successfully!")
        setIsPrescriptionModalOpen(false)
    }

    const isVeterinaryService = booking.service.category === 'veterinary'

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div>
                <Link to="/bookings" className="flex items-center gap-2 text-sm text-[#545F71] hover:text-[#5D6D7E] mb-4">
                    <ArrowLeft size={16} />
                    Back to Bookings
                </Link>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                    <h1 className="text-2xl font-bold text-[#495057]">
                        Booking <span className="text-[#ADB5BD]">#{booking.booking_number}</span>
                    </h1>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsStatusModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]">
                            <Edit size={16} /> Update Status
                        </button>
                        {/* Tombol "Create Prescription" hanya muncul jika service adalah 'veterinary' dan status 'completed' */}
                        {isVeterinaryService && booking.status === 'completed' && (
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
                        <div className="flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Service</span><span className="font-medium text-[#495057] mt-1">{booking.service.name}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Date & Time</span><span className="font-medium text-[#495057] mt-1">{format(new Date(booking.start_time), 'EEEE, MMMM d, yyyy')} from {format(new Date(booking.start_time), 'HH:mm')} to {format(new Date(booking.end_time), 'HH:mm')}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Total Price</span><span className="font-medium text-[#495057] mt-1">${booking.total_price.toFixed(2)}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-[#ADB5BD] uppercase font-semibold">Status</span><span className={`px-2 py-1 text-xs font-medium rounded-full self-start mt-1 capitalize ${getStatusBadge(booking.status)}`}>{booking.status.replace('_', ' ')}</span></div>
                    </div>
                </div>

                <div className="space-y-6">
                     <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                         <h3 className="text-lg font-semibold text-[#495057] mb-4">Customer Information</h3>
                         <div className="space-y-1 text-sm">
                            <p className="font-medium text-[#495057]">{booking.customer.name}</p>
                            <p className="text-[#5D6D7E]">{/* customer.email */}</p>
                            <p className="text-[#5D6D7E]">{/* customer.phone */}</p>
                         </div>
                     </div>
                     <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                         <h3 className="text-lg font-semibold text-[#495057] mb-4">Pet Information</h3>
                         <div className="space-y-1 text-sm">
                             <p className="font-medium text-[#495057]">{booking.pet.name}</p>
                             <p className="text-[#5D6D7E]">{booking.pet.type}</p>
                         </div>
                     </div>
                </div>
            </div>

            {/* Jika sudah ada resep, bisa ditampilkan di sini */}
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
                onSubmit={handlePrescriptionCreate}
                petName={booking.pet.name}
            />
        </div>
    )
}

export default BookingDetailPage