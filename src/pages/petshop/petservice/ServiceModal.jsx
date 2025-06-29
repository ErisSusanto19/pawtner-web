import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

const serviceCategories = ['boarding', 'daycare', 'grooming', 'veterinary'];

const ServiceModal = ({ isOpen, onClose, service }) => {
    const isEditMode = Boolean(service);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [modalContainer, setModalContainer] = useState(null);

    useEffect(() => {
        setModalContainer(document.getElementById("modal-root"));
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                reset(service);
            } else {
                reset({
                    name: '',
                    category: 'grooming',
                    base_price: '',
                    capacity_per_day: '',
                    is_active: true,
                });
            }
        }
    }, [isOpen, service, reset, isEditMode])

    const onSubmit = (data) => {
        const processedData = {
            ...data,
            base_price: parseFloat(data.base_price),
            capacity_per_day: data.capacity_per_day ? parseInt(data.capacity_per_day, 10) : null,
        };
        
        if (isEditMode) {
            console.log('Updating service:', { ...service, ...processedData });
        } else {
            console.log('Creating new service:', processedData);
        }
        onClose();
    };
  
    if (!isOpen || !modalContainer) return null

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-6 relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b border-[#E9ECEF] pb-4">
                    <h2 className="text-xl font-bold text-[#495057]">{isEditMode ? 'Edit Service' : 'Add New Service'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X size={20} className="text-[#ADB5BD]" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#5D6D7E] mb-1">Service Name</label>
                        <input id="name" {...register('name', { required: 'Service name is required.' })} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-[#5D6D7E] mb-1">Category</label>
                        <select id="category" {...register('category', { required: 'Category is required.' })} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white capitalize">
                            {serviceCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="base_price" className="block text-sm font-medium text-[#5D6D7E] mb-1">Base Price ($)</label>
                            <input id="base_price" type="number" step="0.01" {...register('base_price', { required: 'Price is required.', valueAsNumber: true })} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]" />
                            {errors.base_price && <p className="text-red-500 text-xs mt-1">{errors.base_price.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="capacity_per_day" className="block text-sm font-medium text-[#5D6D7E] mb-1">Capacity / Day</label>
                            <input id="capacity_per_day" type="number" placeholder="Optional" {...register('capacity_per_day', { valueAsNumber: true })} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]" />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-2">
                        <input type="checkbox" id="is_active" {...register('is_active')} className="h-4 w-4 rounded border-gray-300 text-[#545F71] focus:ring-[#545F71]" />
                        <label htmlFor="is_active" className="text-sm font-medium text-[#5D6D7E]">Set service as active</label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-[#E9ECEF]">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-[#495057] bg-[#E9ECEF] rounded-md hover:bg-[#C3D3E0]">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]">{isEditMode ? 'Save Changes' : 'Create Service'}</button>
                    </div>
                </form>
            </div>
        </div>,
        modalContainer
    )
}

export default ServiceModal