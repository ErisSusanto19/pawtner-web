import React, { useMemo } from 'react';
import { parseISO, format, isToday, isYesterday } from 'date-fns';
import BookingItem from './BookingItem';
import BookingFilters from './BookingFilters';

const AllBookingsTab = ({ 
    bookings,
    filters,
    onFilterChange,
    onActionClick
}) => {

    const groupedBookings = useMemo(() => {
        return bookings.reduce((acc, booking) => {
            const dateKey = format(parseISO(booking.startTime), 'yyyy-MM-dd')
            if (!acc[dateKey]) {
                acc[dateKey] = []
            }
            acc[dateKey].push(booking)
            return acc;
        }, {})
    }, [bookings])

    const getDateLabel = (dateString) => {
        const date = parseISO(dateString)
        if (isToday(date)) return 'Hari Ini'
        if (isYesterday(date)) return 'Kemarin'
        return format(date, 'EEEE, d MMMM yyyy')
    }


    if (bookings.length === 0) {
        return (
            <div>
                 <BookingFilters filters={filters} onFilterChange={onFilterChange} />
                 <div className="text-center py-12 text-[#495057]">
                     <p className="mt-4 font-medium">No bookings found matching your filter.</p>
                 </div>
            </div>
        )
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-[#495057] mb-4">
                All Bookings History
            </h3>
            <BookingFilters filters={filters} onFilterChange={onFilterChange} />

            {/* {Object.keys(groupedBookings).map(dateKey => (
                <div key={dateKey} className="mt-6">
                    <h4 className="text-md font-semibold text-[#5D6D7E] pt-4 pb-2 border-b border-gray-200 mb-3">
                        {getDateLabel(dateKey)}
                    </h4>
                    <div className="space-y-3">
                        {groupedBookings[dateKey].map(booking => (
                            <BookingItem
                                key={booking.id}
                                booking={booking}
                                onActionClick={onActionClick}
                            />
                        ))}
                    </div>
                </div>
            ))} */}

            <div className="space-y-3 mt-4">
                {bookings.map(booking => (
                    <BookingItem
                        key={booking.id}
                        booking={booking}
                        onActionClick={onActionClick}
                        showDate={true}
                    />
                ))}
            </div>
        </div>
    )
}

export default AllBookingsTab