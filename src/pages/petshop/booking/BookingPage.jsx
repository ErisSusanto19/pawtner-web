import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfToday, parseISO } from 'date-fns';
import { MoreVertical, Calendar, Tag, User, Dog } from 'lucide-react';

const today = startOfToday()

const dummyBookings = [
    {
        id: 1, booking_number: 'BK-20231027-001',
        customer: { name: 'Sarah Johnson' },
        pet: { name: 'Max', type: 'Golden Retriever' },
        service: { name: 'Premium Full Grooming' },
        start_time: new Date(today.setHours(9, 0, 0)),
        end_time: new Date(today.setHours(10, 30, 0)),
        total_price: 55.00,
        status: 'confirmed'
    },
    {
        id: 2, booking_number: 'BK-20231027-002',
        customer: { name: 'Mike Chen' },
        pet: { name: 'Whiskers', type: 'Persian Cat' },
        service: { name: 'General Health Check-up' },
        start_time: new Date(today.setHours(10, 30, 0)),
        end_time: new Date(today.setHours(11, 0, 0)),
        total_price: 60.00,
        status: 'awaiting_payment'
    },
    {
        id: 3, booking_number: 'BK-20231027-003',
        customer: { name: 'Emily Davis' },
        pet: { name: 'Rocky', type: 'Border Collie' },
        service: { name: 'Full Day Playtime' },
        start_time: new Date(today.setHours(12, 0, 0)),
        end_time: new Date(today.setHours(17, 0, 0)),
        total_price: 25.00,
        status: 'requested'
    },
    {
        id: 4, booking_number: 'BK-20231027-004',
        customer: { name: 'Robert Wilson' },
        pet: { name: 'Fifi', type: 'Poodle' },
        service: { name: 'Basic Bath & Brush' },
        start_time: new Date(today.setHours(14, 0, 0)),
        end_time: new Date(today.setHours(15, 0, 0)),
        total_price: 30.00,
        status: 'confirmed'
    },
     {
        id: 5, booking_number: 'BK-20231027-005',
        customer: { name: 'Budi Hartono' },
        pet: { name: 'Kiko', type: 'Domestic Shorthair' },
        service: { name: 'Annual Vaccination Package' },
        start_time: new Date(new Date().setDate(today.getDate() + 1)).setHours(11, 0, 0),
        end_time: new Date(new Date().setDate(today.getDate() + 1)).setHours(11, 45, 0),
        total_price: 85.00,
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
};

const BookingPage = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(format(today, 'yyyy-MM-dd'))

    const filteredBookings = useMemo(() => {
        return dummyBookings
            .filter(booking => format(new Date(booking.start_time), 'yyyy-MM-dd') === selectedDate)
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    }, [selectedDate])
    
    const services = ['All Services', ...new Set(dummyBookings.map(b => b.service.name))]

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-2xl font-bold text-[#495057]">Booking Management</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
                        <input 
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full border border-[#E9ECEF] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                    <h3 className="text-lg font-semibold text-[#495057] mb-4">
                        Schedule for {format(parseISO(selectedDate), 'MMMM d, yyyy')}
                    </h3>
                    <div className="space-y-3">
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <div 
                                    key={booking.id} 
                                    onClick={() => navigate(`/bookings/${booking.id}`)}
                                    className="flex items-center justify-between p-4 border border-[#E9ECEF] rounded-lg hover:bg-[#F8F9FA] transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-center w-16">
                                            <p className="font-bold text-lg text-[#545F71]">{format(new Date(booking.start_time), 'HH:mm')}</p>
                                            <p className="text-xs text-[#ADB5BD]">~{format(new Date(booking.end_time), 'HH:mm')}</p>
                                        </div>
                                        <div className="border-l border-[#E9ECEF] pl-4">
                                            <p className="font-semibold text-[#5D6D7E]">{booking.service.name}</p>
                                            <p className="text-sm text-[#495057]">{booking.customer.name}</p>
                                            <p className="text-xs text-[#ADB5BD]">Pet: {booking.pet.name} ({booking.pet.type})</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(booking.status)}`}>
                                            {booking.status.replace('_', ' ')}
                                        </span>
                                        <button 
                                            onClick={() => alert(`Actions for ${booking.booking_number}`)}
                                            className="p-1 text-[#545F71] hover:text-gray-800" title="More Actions">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-[#495057]">
                                <Calendar size={48} className="mx-auto text-[#C3D3E0]" />
                                <p className="mt-4 font-medium">No bookings for this day.</p>
                                <p className="text-sm text-[#ADB5BD]">Try selecting another date.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                        <h3 className="text-lg font-semibold text-[#495057] mb-4">Quick Stats</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center"><span className="text-[#5D6D7E]">Today's Bookings</span><span className="font-bold text-[#495057]">8</span></div>
                            <div className="flex justify-between items-center"><span className="text-[#5D6D7E]">Awaiting Approval</span><span className="font-bold text-yellow-600">3</span></div>
                            <div className="flex justify-between items-center"><span className="text-[#5D6D7E]">This Week's Revenue</span><span className="font-bold text-green-600">$1,250</span></div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                        <h3 className="text-lg font-semibold text-[#495057] mb-4">Upcoming Important Bookings</h3>
                        <div className="space-y-4">
                             {dummyBookings.filter(b => b.status === 'requested').slice(0, 3).map(b => (
                                <div key={b.id} onClick={() => navigate(`/bookings/${b.id}`)} className="text-sm">
                                    <div className="flex justify-between items-center">
                                       <span className="font-medium text-[#5D6D7E]">{b.service.name}</span>
                                       <span className="text-xs text-[#ADB5BD]">{format(new Date(b.start_time), 'MMM d, HH:mm')}</span>
                                    </div>
                                    <p className="text-xs text-[#ADB5BD]">by {b.customer.name}</p>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingPage