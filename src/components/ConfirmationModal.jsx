import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from './Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

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
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="flex-grow p-6">
                    <p className="text-sm text-gray-600">
                        {message || 'Are you sure you want to proceed?'}
                    </p>
                </div>

                <div className="flex-shrink-0 p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-end gap-3">
                        <Button
                            buttonType="button"
                            onClick={onClose}
                            secondary={true}
                        >
                            Cancel
                        </Button>
                        <Button
                            buttonType="button"
                            onClick={onConfirm}
                            danger={true}
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