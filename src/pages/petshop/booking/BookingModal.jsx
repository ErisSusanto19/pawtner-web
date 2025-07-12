import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const statuses = [
    { value: "AWAITING_PAYMENT", label: "Awaiting Payment" },
    { value: "REQUESTED", label: "Requested" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
]

const BookingModal = ({ isOpen, onClose, currentStatus, onUpdate, isLoading }) => {
    const [newStatus, setNewStatus] = useState(currentStatus)

    useEffect(() => {
        if (isOpen) {
            setNewStatus(currentStatus)
        }
    }, [isOpen, currentStatus])

    if (!isOpen) {
        return null
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onUpdate(newStatus)
    }

    const formatStatusText = (status) => {
        return (status || '').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    }

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-50 bg-black/50"
            onClick={() => !isLoading && onClose()}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-6 border-b border-[#E9ECEF]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#495057]">
                            Update Booking Status
                        </h2>
                        <button disabled={isLoading} onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                            <X size={20} className="text-[#ADB5BD]" />
                        </button>
                    </div>
                </div>

                <fieldset disabled={isLoading} className="contents">
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-[#5D6D7E] mb-2">
                                Select New Status
                            </label>
                            <select
                                id="status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white"
                            >
                                {/* {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {formatStatusText(status)}
                                    </option>
                                ))} */}
                                {statuses.map(el => (
                                    <option key={el.value} value={el.value}>{formatStatusText(el.label)}</option>
                                ))}
                            </select>
                        </div>
                    </form>
                </fieldset>

                <div className="flex-shrink-0 p-6 border-t border-[#E9ECEF]">
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold text-[#495057] bg-[#E9ECEF] rounded-md hover:bg-[#C3D3E0] disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading || newStatus === currentStatus}
                            className="px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057] disabled:bg-[#ADB5BD] disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingModal