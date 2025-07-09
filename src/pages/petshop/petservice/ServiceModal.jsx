import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import Input from '../../../components/Input';
import TextArea from '../../../components/TextArea';
import FileUpload from '../../../components/FileUploadV2';
import Spinner from '../../../components/Spinner';
import Button from '../../../components/Button';
import clsx from 'clsx';

const serviceCategories = [
    {value: 'GROOMING', label: 'Grooming'}, 
    {value: 'BOARDING', label: 'Boarding'}, 
    {value: 'VETERINARY', label: 'Veterinary'}, 
    {value: 'DAYCARE', label: 'Daycare'}, 
]

const ServiceModal = ({ isOpen, onClose, service, onSave, isLoading }) => {
    const isEditMode = Boolean(service)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const defaultValues = useMemo(() => {
        return isEditMode 
            ? service 
            : {
                name: '',
                category: '',
                description: '',
                basePrice: '',
                capacityPerDay: '',
                // isActive: true,
                imageUrl: null,
              };
    }, [isEditMode, service])

    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
        mode: 'onChange',
        defaultValues,
    })

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset])

    useEffect(() => {
        register("imageUrl")
    }, [register])
    
    useEffect(() => {
        if (!isOpen) {
            setIsSubmitting(false)
        }
    }, [isOpen])

    const onSubmit = async (data) => {
        const finalData = {
            ...data,
            basePrice: parseFloat(String(data.basePrice).replace(',', '.')),
            capacityPerDay: data.capacityPerDay ? parseInt(data.capacityPerDay, 10) : null,
        }

        if (onSave) {
            setIsSubmitting(true)
            try {
                await onSave(finalData)
                if (!isEditMode) {
                    reset({
                    name: '',
                    category: '',
                    description: '',
                    basePrice: '',
                    capacityPerDay: '',
                    imageUrl: null,
                    })
                }
                onClose()
            } catch (error) {
                console.error("Failed to save service:", error);
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    if (!isOpen) return null;

     return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col" style={{ maxHeight: "90vh" }}>
                <div className="flex-shrink-0 p-6 border-b border-[#E9ECEF]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#495057]">{isEditMode ? 'Edit Service' : 'Add New Service'}</h2>
                        <button disabled={isSubmitting} onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={20} className="text-[#ADB5BD]" /></button>
                    </div>
                </div>
                
                <fieldset disabled={isSubmitting || isLoading} className="flex-grow contents">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto p-6 space-y-4">
                        
                        <Input
                            id="name"
                            label="Service Name"
                            register={register}
                            rules={{ required: 'Service name is required.' }}
                            errors={errors}
                        />

                        <TextArea
                            id="description"
                            label="Description"
                            register={register}
                            errors={errors}
                            rows={3}
                        />
                        
                        <div className="w-full">
                            <label htmlFor="category" className="block text-sm text-gray-900 font-medium mb-1">Category</label>
                            <select 
                                id="category"
                                {...register("category", { required: "Category is required" })}
                                className={clsx(
                                    "block w-full border rounded-md border-gray-300 focus:outline-none p-2 focus:ring-2 focus:ring-[#545F71] bg-white capitalize",
                                    errors.category && "ring-1 ring-red-500 border-red-500" // Sedikit penyesuaian gaya error
                                )}
                            >
                                {serviceCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="basePrice" className="block text-sm font-medium text-gray-900 mb-1">Base Price</label>
                                <input id="basePrice" type="number" step="any" {...register('basePrice', { required: 'Price is required.', valueAsNumber: true, min: { value: 0, message: "Price can't be negative" } })} className="w-full border rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]" />
                                {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="capacityPerDay" className="block text-sm font-medium text-gray-900 mb-1">Capacity / Day</label>
                                <input id="capacityPerDay" type="number" placeholder="Optional" {...register('capacityPerDay', { valueAsNumber: true, min: { value: 0, message: "Capacity can't be negative" } })} className="w-full border rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]" />
                                {errors.capacityPerDay && <p className="text-red-500 text-xs mt-1">{errors.capacityPerDay.message}</p>}
                            </div>
                        </div>
                        
                        <FileUpload
                          name="imageUrl"
                          label="Service Image"
                          accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                          setValue={setValue}
                          watch={watch}
                          errors={errors}
                        />
                    </form>
                </fieldset>

                <div className="flex-shrink-0 p-6 border-t border-[#E9ECEF]">
                    <div className="flex justify-end gap-4">
                        <Button buttonType="button" onClick={onClose} secondary={true} disabled={isSubmitting || isLoading}>Cancel</Button>
                        <Button buttonType="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting || isLoading}>
                            {isSubmitting ? <><Spinner /> Saving...</> : (isEditMode ? 'Save Changes' : 'Create Service')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceModal