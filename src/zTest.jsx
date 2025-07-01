import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// HAPUS definisi statuseOptions dari sini.
// const statuseOptions = [ ... ];

// PENYESUAIAN: Komponen sekarang menerima `statusOptions` sebagai prop
const OrderModal = ({ 
    isOpen, 
    onClose, 
    currentStatus, 
    onUpdate, 
    isUpdating, 
    updateError,
    statusOptions // Prop baru dari parent
}) => {
    const [newStatus, setNewStatus] = useState(currentStatus);

    useEffect(() => {
        if (isOpen) {
            setNewStatus(currentStatus);
        }
    }, [isOpen, currentStatus]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(newStatus);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={!isUpdating ? onClose : undefined}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-[#E9ECEF] pb-4">
                    <h2 className="text-xl font-bold text-[#495057]">
                        Update Order Status
                    </h2>
                    {/* Tambahkan disabled saat isUpdating */}
                    <button onClick={!isUpdating ? onClose : undefined} disabled={isUpdating} className="p-1 rounded-full hover:bg-[#F8F9FA]">
                        <X size={20} className="text-[#ADB5BD]" />
                    </button>
                </div>

                {updateError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{updateError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="w-full">
                        <label htmlFor="status" className="block text-sm text-gray-900 font-medium mb-2">Status</label>
                        <select 
                            id="status" 
                            name="status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            disabled={isUpdating} // Tambahkan disabled di sini juga
                            className="block w-full border rounded-md border-[#CED4DA] focus:outline-none p-2 focus:ring-2 focus:ring-[#545F71] shadow-sm disabled:bg-gray-100"
                        >
                            {/* PENYESUAIAN: Gunakan prop `statusOptions` yang diterima dari parent */}
                            {statusOptions.map(el => (
                                <option key={el.value} value={el.value}>{el.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-[#E9ECEF]">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUpdating}
                            className="px-4 py-2 text-sm font-semibold text-[#495057] bg-[#E9ECEF] rounded-md hover:bg-[#C3D3E0] disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={newStatus === currentStatus || isUpdating}
                            className="px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057] disabled:bg-[#6C757D] disabled:cursor-not-allowed"
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderModal;