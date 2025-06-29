import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, PlusCircle, Trash2 } from 'lucide-react';

const CreatePrescriptionModal = ({ isOpen, onClose, onSubmit, petName }) => {
    const [modalContainer, setModalContainer] = useState(null);
    const { register, control, handleSubmit, reset } = useForm({
        defaultValues: {
            notes: '',
            items: [{ medication_name: '', dosage: '', frequency: '', duration_days: '', instructions: '' }]
        }
    });
    
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    useEffect(() => {
        setModalContainer(document.getElementById("modal-root"))
        if (!isOpen) {
            reset()
        }
    }, [isOpen, reset]);

    if (!isOpen || !modalContainer) return null
    
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-16 z-50 overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 space-y-6 relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b border-[#E9ECEF] pb-4">
                    <h2 className="text-xl font-bold text-[#495057]">Create New Prescription for {petName}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X size={20} className="text-[#ADB5BD]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-[#5D6D7E] mb-1">General Notes</label>
                        <textarea id="notes" {...register('notes')} rows="3" placeholder="e.g., Follow up in 2 weeks..." className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]"></textarea>
                    </div>

                    <h3 className="text-lg font-semibold text-[#495057] pt-2 border-t border-[#E9ECEF]">Medications</h3>
                    
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-12 gap-3 p-4 border border-[#F8F9FA] rounded-lg relative">
                                <div className="col-span-12 md:col-span-6">
                                    <label className="block text-xs font-medium text-[#5D6D7E] mb-1">Medication Name</label>
                                    <input {...register(`items.${index}.medication_name`, { required: true })} className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm" />
                                </div>
                                <div className="col-span-6 md:col-span-3">
                                    <label className="block text-xs font-medium text-[#5D6D7E] mb-1">Dosage</label>
                                    <input {...register(`items.${index}.dosage`, { required: true })} placeholder="e.g., 1 tablet" className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm" />
                                </div>
                                <div className="col-span-6 md:col-span-3">
                                    <label className="block text-xs font-medium text-[#5D6D7E] mb-1">Frequency</label>
                                    <input {...register(`items.${index}.frequency`, { required: true })} placeholder="e.g., 2x a day" className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm" />
                                </div>
                                <div className="col-span-12 md:col-span-9">
                                    <label className="block text-xs font-medium text-[#5D6D7E] mb-1">Instructions</label>
                                    <input {...register(`items.${index}.instructions`)} placeholder="e.g., After meals" className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm" />
                                </div>
                                <div className="col-span-8 md:col-span-2">
                                    <label className="block text-xs font-medium text-[#5D6D7E] mb-1">Duration (Days)</label>
                                    <input type="number" {...register(`items.${index}.duration_days`, { required: true, valueAsNumber: true })} className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm" />
                                </div>
                                <div className="col-span-4 md:col-span-1 flex items-end">
                                    {fields.length > 1 && (
                                        <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => append({ medication_name: '', dosage: '', frequency: '', duration_days: '', instructions: '' })}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[#545F71] bg-white border border-[#E9ECEF] rounded-md hover:bg-[#F8F9FA]"
                    >
                        <PlusCircle size={16} /> Add Medication
                    </button>

                    <div className="flex justify-end gap-4 pt-4 border-t border-[#E9ECEF]">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-[#495057] bg-[#E9ECEF] rounded-md hover:bg-[#C3D3E0]">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Create Prescription</button>
                    </div>
                </form>
            </div>
        </div>,
        modalContainer
    )
}

export default CreatePrescriptionModal