import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import Input from '../../../components/Input';
import Button from '../../../components/Button'
import TextArea from '../../../components/TextArea';
import FileUpload from '../../../components/FileUploadV2'
import clsx from 'clsx';
import Spinner from '../../../components/Spinner';

const categoryProduct = [
  {value: "FOOD", label: "Food"},
  {value: "TOYS", label: "Toys"},
  {value: "ACCESSORIES", label: "Accessories"},
  {value: "HEALTH", label: "Health"},
  {value: "GROOMING_KIT", label: "Grooming Kit"}
]

const ProductModal = ({isOpen, onClose, product, onSave, isLoading }) => {
  const isEditMode = Boolean(product)
   const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues = useMemo(() => {
    return isEditMode 
      ? product 
      : {
          name: '',
          description: '',
          category: '',
          price: '',
          stockQuantity: '',
          imageUrl: null,
          // isActive: true,
        }
  }, [isEditMode, product])

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues
  })

  useEffect(() => {
    register("imageUrl")
  }, [register])

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const onSubmit = async (data) => {
    const finalData = {
      ...data,
      price: parseFloat(String(data.price).replace(',', '.')),
      stockQuantity: parseInt(data.stockQuantity, 10),
    }

    if (onSave) {
      setIsSubmitting(true)
        try {
            await onSave(finalData)
            if (!isEditMode) {
              reset({
                name: '',
                description: '',
                category: '',
                price: '',
                stockQuantity: '',
                imageUrl: null,
              })
            }
            onClose()
        } catch (error) {
            console.error("Failed to save product:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    onClose()
  }

  useEffect(() => {
    if (!isOpen) {
        setIsSubmitting(false)
    }
  }, [isOpen])

  // const isActiveValue = watch('isActive')

  if(!isOpen) return null

  return (
    <div
        className="fixed inset-0 flex justify-center items-center z-50 bg-black/50"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isSubmitting) {
            onClose();
          }
        }}
    >

      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col relative"
        style={{maxHeight: "90vh"}}
        // onClick={(e) => e.stopPropagation()}
      >

      <div className="flex-shrink-0 p-6 border-b border-[#E9ECEF]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#495057]">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button disabled={isSubmitting} onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={20} className="text-[#ADB5BD]" />
          </button>
        </div>
      </div>
      
      <fieldset disabled={isSubmitting} className="flex-grow contents">
        <div className="flex-grow overflow-y-auto p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="name"
              label="Product Name"
              register={register}
              rules={{ required: 'Product name is required.' }}
              errors={errors}
            />

            <TextArea
              id="description"
              label="Description"
              register={register}
              rules={{ required: 'Description is required.' }}
              errors={errors}
              rows={3}
            />
            
            <div className="w-full">
                <label htmlFor="category" className="block text-sm text-gray-900 font-medium mb-2">Category</label>
                <select 
                    id="category" 
                    name="category"
                    {...register("category", {
                        required: {value: true, message: "Category is required"}
                    })}
                    className={clsx(
                        "block w-full border rounded-md border-[#545F71] focus:outline-none p-1.5 focus:ring focus:ring-[#545F71] focus:border-none shadow-md",
                        errors["category"] && "ring-rose-500",
                    )}
                >
                    <option value="" disabled className="text-sm text-gray-500">Select a category</option>

                    {categoryProduct.map(el => (
                        <option key={el.value} value={el.value}>{el.label}</option>
                    ))}
                </select>

                {errors["category"] && (
                    <p className="text-rose-500 text-sm mt-1">
                        {errors["category"].message}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <label htmlFor="price" className="block text-sm text-gray-900 font-medium mb-2">Price</label>
                <input
                  id="price"
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g., 25.50"
                  className={clsx(
                    "block w-full border rounded-md border-[#545F71] focus:outline-none p-1.5 focus:ring focus:ring-[#545F71] focus:border-none shadow-md",
                    errors.price && "ring-rose-500"
                  )}
                  {...register("price", {
                    required: 'Price is required.',
                    pattern: {
                      value: /^\d+([.,]\d{1,2})?$/,
                      message: 'Please enter a valid price.'
                    },
                    validate: value => {
                      const parsedValue = parseFloat(String(value).replace(',', '.'))
                      if (isNaN(parsedValue)) return 'Invalid number format.'
                      if (parsedValue < 0) return 'Price cannot be negative.'
                      return true
                    }
                  })}
                />
                {errors.price && (
                  <p className="text-rose-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              
              <Input
                id="stockQuantity"
                label="Stock Quantity"
                buttonType="number"
                register={register}
                rules={{ 
                  required: 'Stock is required.', 
                  valueAsNumber: true,
                  min: {
                      value: 0,
                      message: 'Stock cannot be negative.'
                  }
                }}
                errors={errors}
              />
            </div>

            {/* <div className="flex flex-col">
              <label htmlFor="isActive" className="block text-sm text-gray-900 font-medium mb-2">Product Status</label>
              <div className="flex items-center gap-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="isActive" {...register('isActive')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#545F71] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#545F71]"></div>
                </label>
                <span className={clsx("font-medium", isActiveValue ? "text-green-600" : "text-red-600")}>
                  {isActiveValue ? 'Active' : 'Archived'}
                </span>
              </div>
            </div> */}

            <FileUpload
              name="imageUrl"
              label="Product Image"
              accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
              // register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
              // rules={{ required: 'Profile picture is required.' }}
            />
          </form>
        </div>
      </fieldset>

      <div className="flex-shrink-0 p-6 border-t border-[#E9ECEF]">
        <div className="flex justify-end gap-4">
          <Button
            buttonType="button"
            onClick={onClose}
            secondary={true}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            buttonType="button"
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner /> {/* Kita akan buat komponen ini */}
                <span>Saving...</span>
              </div>
            ) : (
              isEditMode ? 'Save Changes' : 'Create Product'
            )}
          </Button>
        </div>
      </div>

      </div>
    </div>
  )
}

export default ProductModal