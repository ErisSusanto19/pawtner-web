import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from './Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading = false, reasonInput = null }) => {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (isOpen) {
            setReason('')
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleConfirm = () => {
        onConfirm(reason)
    };

    const isReasonRequiredAndEmpty = reasonInput && reason.trim() == ''
    const isConfirmDisabled = isLoading || isReasonRequiredAndEmpty

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-50 bg-black/60"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={20} />
                            {title || 'Confirm Action'}
                        </h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200" disabled={isLoading}>
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="flex-grow p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        {message || 'Are you sure you want to proceed?'}
                    </p>

                    {reasonInput && (
                        <div className="space-y-2">
                            <label htmlFor="confirmation-reason" className="block text-sm font-medium text-gray-700">
                                {reasonInput.label || 'Reason'}
                            </label>
                            <textarea
                                id="confirmation-reason"
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]"
                                placeholder={reasonInput.placeholder || 'Please provide a reason...'}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-end gap-3">
                        <Button
                            buttonType="button"
                            onClick={onClose}
                            secondary={true}
                            disabled={isLoading} 
                        >
                            Cancel
                        </Button>
                        <Button
                            buttonType="button"
                            onClick={handleConfirm}
                            danger={true}
                            isLoading={isLoading}
                            disabled={isConfirmDisabled}
                            title={isReasonRequiredAndEmpty ? 'A reason is required to proceed.' : 'Confirm action'}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal