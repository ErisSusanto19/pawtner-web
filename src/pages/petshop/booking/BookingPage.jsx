import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, parseISO, startOfToday, isToday, isYesterday, startOfWeek, endOfWeek, isWithinInterval, formatISO } from 'date-fns';
import { MoreVertical, Calendar } from 'lucide-react';
import { fetchBusinessBookings, changeBookingStatus } from '../../../store/slices/bookingSlice';
import PageLoader from '../../../components/PageLoader';
import AllBookingsTab from './AllBookingsTab';
import DailyScheduleTab from './DailyScheduleTab';
import BookingStats from './BookingStats';
import ConfirmModal from '../../../components/ConfirmationModal';
import { useDebounce } from '../../../hooks/useDebounce';
import Pagination from '../../../components/Pagination';

const BookingPage = () => {
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('schedule')
    const [selectedDate, setSelectedDate] = useState(format(startOfToday(), 'yyyy-MM-dd'));

    const { items: bookings, pagination, status, error } = useSelector((state) => state.bookings);

    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ nameCustomer: '', bookingStatus: '' });
    const debouncedSearchTerm = useDebounce(filters.nameCustomer, 500);

    const [modalState, setModalState] = useState({ isOpen: false, booking: null, action: null });

    useEffect(() => {
         if (activeTab === 'schedule') {
            dispatch(fetchBusinessBookings({
                page: 0,
                size: 100,
                sortBy: 'startTime',
                direction: 'asc'
            }));
        } else if (activeTab === 'all') {
            dispatch(fetchBusinessBookings({
                page: currentPage - 1,
                size: 5,
                nameCustomer: debouncedSearchTerm,
                bookingStatus: filters.bookingStatus || null,
                sortBy: 'startTime',
                direction: 'desc'
            }));
        }

    }, [dispatch, activeTab, currentPage, debouncedSearchTerm, filters.bookingStatus, selectedDate])

    useEffect(() => {
        if (status === 'failed' && bookings.length > 0) {
            toast.error(`Failed to refresh bookings: ${error}`)
        }
    }, [status, error, bookings.length])

    const handleTabClick = (tabName) => {
        if (tabName === 'all' && activeTab !== 'all') {
            setCurrentPage(1)
        }
        setActiveTab(tabName)
    }

    const handleFilterChange = (newFilters) => {
        setCurrentPage(1)
        setFilters(newFilters)
    }

    const handleActionClick = (booking, action) => {
        if (action === 'CANCEL') {
            setModalState({ isOpen: true, booking, action: 'CANCEL' });
        }
    }

    const handleConfirmAction = () => {
        if (modalState.booking && modalState.action === 'CANCEL') {
            dispatch(changeBookingStatus({ bookingId: modalState.booking.id, status: 'CANCELLED' }))
        }
        setModalState({ isOpen: false, booking: null, action: null })
    }

    const scheduleBookings = useMemo(() => {
        if (activeTab === 'schedule') {
            return bookings.filter(b => format(parseISO(b.startTime), 'yyyy-MM-dd') === selectedDate)
        }
        return []
    }, [bookings, selectedDate, activeTab])

    if (status === 'loading' && bookings.length === 0) {
        return <PageLoader message="Loading bookings..."/>
    }

    if (status === 'failed') {
        return <div className="p-6 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">

            <ConfirmModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, booking: null, action: null })}
                onConfirm={handleConfirmAction}
                title="Konfirmasi Pembatalan"
                message={`Anda yakin ingin membatalkan booking #${modalState.booking?.bookingNumber}?`}
            >
                Apakah Anda yakin ingin melakukan tindakan ini pada booking nomor {modalState.booking?.bookingNumber}?
            </ConfirmModal>

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
                                onClick={() => handleTabClick('schedule')}
                                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'schedule'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Daily Schedule
                            </button>
                            <button
                                onClick={() => handleTabClick('all')}
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
                        <DailyScheduleTab 
                            bookings={scheduleBookings}
                            selectedDate={selectedDate}
                            onActionClick={handleActionClick}
                            isLoading={status === 'loading'}
                        />
                    )}
                    
                    {activeTab === 'all' && (
                        <>
                            <AllBookingsTab 
                                bookings={bookings}
                                pagination={pagination}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onPageChange={setCurrentPage}
                                onActionClick={handleActionClick}
                            />
                            {pagination.totalPages > 1 && (
                                <div className="mt-6">
                                    <Pagination
                                        currentPage={pagination.number + 1}
                                        totalPages={pagination.totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </>
                    )}

                </div>

                <div className="space-y-6">
                    <BookingStats/>
                </div>
            </div>
        </div>
    )
}

export default BookingPage