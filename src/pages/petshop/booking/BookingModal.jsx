import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

const statuses = ['requested', 'pending_approval', 'awaiting_payment', 'confirmed', 'cancelled', 'completed'];

const BookingModal = ({ isOpen, onClose, currentStatus, onUpdate }) => {
    const [newStatus, setNewStatus] = useState(currentStatus);
    const [modalContainer, setModalContainer] = useState(null);

    useEffect(() => {
        setModalContainer(document.getElementById("modal-root"))
    }, []);

    useEffect(() => {
        if (isOpen) {
            setNewStatus(currentStatus);
        }
    }, [isOpen, currentStatus]);

    if (!isOpen || !modalContainer) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onUpdate(newStatus)
    };

    const formatStatusText = (status) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Modal */}
                <div className="flex justify-between items-center border-b border-[#E9ECEF] pb-4">
                    <h2 className="text-xl font-bold text-[#495057]">
                        Update Booking Status
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[#F8F9FA]">
                        <X size={20} className="text-[#ADB5BD]" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {formatStatusText(status)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-[#E9ECEF]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-[#495057] bg-[#E9ECEF] rounded-md hover:bg-[#C3D3E0]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057] disabled:bg-[#ADB5BD] disabled:cursor-not-allowed"

                            disabled={newStatus === currentStatus}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        modalContainer
    )
}

export default BookingModal