import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format, parseISO, startOfToday, isToday, isYesterday, startOfWeek, endOfWeek, isWithinInterval, formatISO } from 'date-fns';
import { MoreVertical, Calendar } from 'lucide-react';
import { fetchBusinessBookings, changeBookingStatus } from '../../../store/slices/bookingSlice';
import { formatCurrencyIDR } from '../../../utils/formatter'

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

const formatStatusText = (status) => status.replace(/_/g, ' ').toLowerCase();

const BookingItem = ({ booking, showDate = false }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/bookings/${booking.id}`)}
            className="flex items-center justify-between p-4 border border-[#E9ECEF] rounded-lg hover:bg-[#F8F9FA] transition-colors cursor-pointer"
        >
            <div className="flex items-center gap-4">
                <div className="text-center w-16">
                    {showDate && (
                         <p className="font-semibold text-xs text-blue-600 mb-1">{format(parseISO(booking.startTime), 'MMM d')}</p>
                    )}
                    <p className="font-bold text-lg text-[#545F71]">{format(parseISO(booking.startTime), 'HH:mm')}</p>
                    <p className="text-xs text-[#ADB5BD]">~{format(parseISO(booking.endTime), 'HH:mm')}</p>
                </div>
                <div className="border-l border-[#E9ECEF] pl-4">
                    <p className="font-semibold text-[#5D6D7E]">{booking.serviceName || 'Service Name'}</p>
                    <p className="text-sm text-[#495057]">{booking.customer?.name || 'Customer Name'}</p>
                    <p className="text-xs text-[#ADB5BD]">Pet: {booking.pet?.name || 'Pet'} ({booking.pet?.breed || 'Type'})</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(booking.status)}`}>
                    {formatStatusText(booking.status)}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        alert(`Actions for ${booking.bookingNumber}`);
                    }}
                    className="p-1 text-[#545F71] hover:text-gray-800" title="More Actions">
                    <MoreVertical size={16} />
                </button>
            </div>
        </div>
    );
};


const BookingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('schedule')
    const [selectedDate, setSelectedDate] = useState(format(startOfToday(), 'yyyy-MM-dd'));

    const { items: bookings, status, error } = useSelector((state) => state.bookings);

    useEffect(() => {
        dispatch(fetchBusinessBookings({ page: 0, size: 100 }));
    }, [dispatch]);

    const filteredBookingsByDate = useMemo(() => {
        if (!bookings) return [];
        return bookings
            .filter(booking => format(parseISO(booking.startTime), 'yyyy-MM-dd') === selectedDate)
            .sort((a, b) => parseISO(a.startTime) - parseISO(b.startTime));
    }, [selectedDate, bookings]);

    const allSortedBookings = useMemo(() => {
        if (!bookings) return [];
        return [...bookings].sort((a, b) => parseISO(b.startTime) - parseISO(a.startTime));
    }, [bookings]);

    const stats = useMemo(() => {
        if (!bookings) return { today: 0, awaiting: 0, weeklyRevenue: 0 };

        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

        const revenueThisWeek = bookings
            .filter(b => {
                const isRevenueGenerating = b.status === 'COMPLETED' || b.status === 'CONFIRMED' || b.status === 'AWAITING_PAYMENT';
                if (!isRevenueGenerating) return false

                const bookingDate = parseISO(b.startTime)
                return isWithinInterval(bookingDate, { start: weekStart, end: weekEnd })
            })
            .reduce((sum, b) => {
                return sum + (b.totalPrice || 0)
            }, 0)

        const todayBookings = bookings.filter(b => isToday(parseISO(b.startTime)));
        const awaitingApproval = bookings.filter(b => b.status === 'REQUESTED' || b.status === 'PENDING_APPROVAL');

        return {
            today: todayBookings.length,
            awaiting: awaitingApproval.length,
            weeklyRevenue: revenueThisWeek
        };
    }, [bookings])

    if (status === 'loading' && bookings.length === 0) {
        return <div className="p-6 text-center">Loading bookings...</div>;
    }

    if (status === 'failed') {
        return <div className="p-6 text-center text-red-500">Error: {error}</div>;
    }
    
    const renderAllBookingsList = () => {
        if (allSortedBookings.length === 0) {
            return (
                 <div className="text-center py-12 text-[#495057]">
                    <p className="mt-4 font-medium">You don't have any bookings yet.</p>
                </div>
            )
        }
        
        const groupedBookings = allSortedBookings.reduce((acc, booking) => {
            const dateKey = format(parseISO(booking.startTime), 'yyyy-MM-dd');
            if(!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(booking);
            return acc;
        }, {});

        const getDateLabel = (dateString) => {
            const date = parseISO(dateString);
            if (isToday(date)) return 'Today';
            if (isYesterday(date)) return 'Yesterday';
            return format(date, 'MMMM d, yyyy');
        };

        return Object.keys(groupedBookings).map(dateKey => (
            <div key={dateKey} className="space-y-3">
                <h4 className="text-md font-semibold text-[#5D6D7E] pt-4 pb-1 border-b border-gray-200">
                    {getDateLabel(dateKey)}
                </h4>
                {groupedBookings[dateKey]
                    .sort((a,b) => parseISO(a.startTime) - parseISO(b.startTime))
                    .map(booking => (
                        <BookingItem key={booking.id} booking={booking} />
                ))}
            </div>
        ));
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-2xl font-bold text-[#495057]">Booking Management</h1>

                {activeTab === 'schedule' && (
                    <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full border border-[#E9ECEF] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white text-sm"
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">

                    <div className="border-b border-gray-200 mb-4">
                        <nav className="-mb-px flex space-x-6">
                            <button
                                onClick={() => setActiveTab('schedule')}
                                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'schedule'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Daily Schedule
                            </button>
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'all'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                All Bookings
                            </button>
                        </nav>
                    </div>

                    {activeTab === 'schedule' && (
                        <div>
                             <h3 className="text-lg font-semibold text-[#495057] mb-4">
                                Schedule for {format(parseISO(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}
                            </h3>
                            <div className="space-y-3">
                                {filteredBookingsByDate.length > 0 ? (
                                    filteredBookingsByDate.map((booking) => (
                                        <BookingItem key={booking.id} booking={booking} />
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
                    )}
                    
                    {activeTab === 'all' && (
                        <div>
                             <h3 className="text-lg font-semibold text-[#495057] mb-4">
                                All Bookings History
                            </h3>
                             <div className="space-y-3">
                                {renderAllBookingsList()}
                            </div>
                        </div>
                    )}

                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                        <h3 className="text-lg font-semibold text-[#495057] mb-4">Quick Stats</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center"><span className="text-[#5D6D7E]">Today's Bookings</span><span className="font-bold text-[#495057]">{stats.today}</span></div>
                            <div className="flex justify-between items-center"><span className="text-[#5D6D7E]">Awaiting Approval</span><span className="font-bold text-yellow-600">{stats.awaiting}</span></div>
                            <div className="flex justify-between items-center"><span className="text-[#5D6D7E]">This Week's Revenue</span><span className="font-bold text-green-600">{formatCurrencyIDR(stats.weeklyRevenue)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingPage