import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, PlusCircle, Trash2 } from 'lucide-react';

const CreatePrescriptionModal = ({ isOpen, onClose, onSave, petName, isLoading }) => {
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            notes: '',
            prescriptionItems: [{ medicationName: '', dosage: '', frequency: '', durationDays: '', instructions: '' }]
        }
    })
    
    const { fields, append, remove } = useFieldArray({
        control,
        name: "prescriptionItems"
    })

    useEffect(() => {
        if (!isOpen) {
            reset({
                notes: '',
                prescriptionItems: [{ medicationName: '', dosage: '', frequency: '', durationDays: '', instructions: '' }]
            });
        }
    }, [isOpen, reset])

    if (!isOpen) return null

    const processSubmit = (data) => {
        const finalData = {
            ...data,
            prescriptionItems: data.prescriptionItems.map(item => ({
                ...item,
                durationDays: parseInt(item.durationDays, 10)
            }))
        };
        onSave(finalData);
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 pb-10 z-50 overflow-y-auto" 
            onClick={() => !isLoading && onClose()}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col relative" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-6 border-b border-[#E9ECEF]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#495057]">Create Prescription for {petName}</h2>
                        <button disabled={isLoading} onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                            <X size={20} className="text-[#ADB5BD]" />
                        </button>
                    </div>
                </div>

                <fieldset disabled={isLoading} className="contents">
                    <form onSubmit={handleSubmit(processSubmit)} className="flex-grow overflow-y-auto p-6 space-y-4">
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-[#5D6D7E] mb-1">General Notes</label>
                            <textarea id="notes" {...register('notes')} rows="3" placeholder="e.g., Follow up in 2 weeks..." className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]"></textarea>
                        </div>

                        <h3 className="text-lg font-semibold text-[#495057] pt-2 border-t border-[#E9ECEF]">Medications</h3>
                        
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-3 p-4 border border-[#F8F9FA] bg-gray-50 rounded-lg relative">
                                    <div className="col-span-12 md:col-span-6">
                                        <label className="block text-xs font-medium text-[#5D6D7E] mb-1">Medication Name</label>
                                        <input {...register(`prescriptionItems.${index}.medicationName`, { required: 'Name is required' })} className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm" />
                                        {errors.prescriptionItems?.[index]?.medicationName && <p className="text-red-500 text-xs mt-1">{errors.prescriptionItems[index].medicationName.message}</p>}
                                    </div>
                                    <div className="col-span-6 md:col-span-3">
                                        <label className="block text-xs font-medium text-[#5D6D7E] mb-1">Dosage</label>
                                        <input {...register(`prescriptionItems.${index}.dosage`, { required: 'Dosage is required' })} placeholder="e.g., 250mg" className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm" />
                                        {errors.prescriptionItems?.[index]?.dosage && <p className="text-red-500 text-xs mt-1">{errors.prescriptionItems[index].dosage.message}</p>}
                                    </div>
                                    <div className="col-span-6 md:col-span-3">
                                        <label className="block text-xs font-medium text-[#5D6D7E] mb-1">Frequency</label>
                                        <input {...register(`prescriptionItems.${index}.frequency`, { required: 'Frequency is required' })} placeholder="e.g., Twice a day" className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm" />
                                        {errors.prescriptionItems?.[index]?.frequency && <p className="text-red-500 text-xs mt-1">{errors.prescriptionItems[index].frequency.message}</p>}
                                    </div>
                                    <div className="col-span-12 md:col-span-9">
                                        <label className="block text-xs font-medium text-[#5D6D7E] mb-1">Instructions</label>
                                        <input {...register(`prescriptionItems.${index}.instructions`)} placeholder="e.g., With food" className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm" />
                                    </div>
                                    <div className="col-span-8 md:col-span-2">
                                        <label className="block text-xs font-medium text-[#5D6D7E] mb-1">Duration (Days)</label>
                                        <input type="number" {...register(`prescriptionItems.${index}.durationDays`, { required: 'Duration is required', min: { value: 1, message: 'Min 1 day' } })} className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm" />
                                        {errors.prescriptionItems?.[index]?.durationDays && <p className="text-red-500 text-xs mt-1">{errors.prescriptionItems[index].durationDays.message}</p>}
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
                            onClick={() => append({ medicationName: '', dosage: '', frequency: '', durationDays: '', instructions: '' })}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[#545F71] bg-white border border-[#E9ECEF] rounded-md hover:bg-[#F8F9FA]"
                        >
                            <PlusCircle size={16} /> Add Medication
                        </button>
                    </form>
                </fieldset>
                
                <div className="flex-shrink-0 p-6 border-t border-[#E9ECEF]">
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-semibold text-[#495057] bg-[#E9ECEF] rounded-md hover:bg-[#C3D3E0] disabled:opacity-50">Cancel</button>
                        <button type="button" onClick={handleSubmit(processSubmit)} disabled={isLoading} className="px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057] disabled:bg-blue-300">
                            {isLoading ? "Saving..." : "Create Prescription"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePrescriptionModal