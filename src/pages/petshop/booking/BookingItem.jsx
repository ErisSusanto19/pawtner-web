import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { MoreVertical } from 'lucide-react';

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

const formatStatusText = (status) => {
    return status.replace(/_/g, ' ').toLowerCase()
}

const BookingItem = ({ booking, onActionClick, showDate = false }) => {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMenuAction = (e, action) => {
        e.stopPropagation()
        setIsMenuOpen(false)
        onActionClick(booking, action)
    };

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
                {/* <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsMenuOpen(prev => !prev)
                    }}
                    className="p-1 text-[#545F71] hover:text-gray-800 rounded-full" title="More Actions">
                    <MoreVertical size={16} />
                </button> */}
                {/* {isMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-20">
                        <ul className="py-1 text-sm text-gray-700">
                            {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                                    <li>
                                        <a href="#" onClick={(e) => handleMenuAction(e, 'CANCEL')}
                                        className="block px-4 py-2 hover:bg-gray-100 text-red-500">
                                            Batalkan Booking
                                        </a>
                                    </li>
                            )}
                            <li>
                                <a href="#" onClick={(e) => { e.stopPropagation(); navigate(`/bookings/${booking.id}`) }}
                                    className="block px-4 py-2 hover:bg-gray-100">
                                    Lihat Detail
                                </a>
                            </li>

                        </ul>
                    </div>
                )} */}
            </div>
        </div>
    )
}

export default BookingItem