import React from 'react';

const BookingFilters = ({ filters, onFilterChange }) => {
    const handleInputChange = (e) => {
        onFilterChange({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
                type="text"
                name="nameCustomer"
                value={filters.nameCustomer}
                onChange={handleInputChange}
                placeholder="Cari nama pelanggan..."
                className="w-full md:w-1/2 border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white text-sm"
            />
            <select
                name="bookingStatus"
                value={filters.bookingStatus}
                onChange={handleInputChange}
                className="w-full md:w-1/2 border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white text-sm"
            >
                <option value="">All Status</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="AWAITING_PAYMENT">Awaiting Payment</option>
                <option value="REQUESTED">Requested</option>
                <option value="CANCELLED">Cancelled</option>
            </select>
        </div>
    );
};

export default BookingFilters