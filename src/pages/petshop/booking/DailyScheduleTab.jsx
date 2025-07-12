import React, { useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import { Calendar } from 'lucide-react';
import BookingItem from './BookingItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinessBookings } from '../../../store/slices/bookingSlice'
import PageLoader from '../../../components/PageLoader';

const DailyScheduleTab = ({ bookings, selectedDate, onActionClick, isLoading }) => {
    // const dispatch = useDispatch()

    // const { items: scheduleBookings, status } = useSelector((state) => state.bookings);

    // useEffect(() => {
    //      dispatch(fetchBusinessBookings({
    //         date: selectedDate,
    //         page: 0,
    //         size: 100,
    //         sortBy: 'startTime',
    //         direction: 'asc'
    //     }));
    // }, [dispatch, selectedDate])

    const sortedBookings = [...bookings].sort((a, b) => parseISO(a.startTime) - parseISO(b.startTime));

    if (isLoading) {
        return <PageLoader message="Loading schedule..." />;
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-[#495057] mb-4">
                Schedule for {format(parseISO(selectedDate), 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-3">
                {sortedBookings.length > 0 ? (
                    sortedBookings.map((booking) => (
                        <BookingItem key={booking.id} booking={booking} onActionClick={onActionClick} />
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
    )
}

export default DailyScheduleTab