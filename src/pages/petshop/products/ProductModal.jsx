import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom'
import Input from '../../../components/Input';
import TextArea from '../../../components/TextArea';

const ProductModal = ({ isOpen, onClose, product }) => {
  const isEditMode = Boolean(product)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const [modalContainer, setModalContainer] = useState()

  useEffect(() => {
    setModalContainer(document.getElementById("modal-root"))
  }, [])

  useEffect(() => {
    if(isOpen){
        if (isEditMode) {
          reset(product)
        } else {
          reset({
            name: '',
            description: '',
            category: '',
            price: '',
            stock: '',
          })
        }
    }
  }, [isOpen, product, reset, isEditMode]);

  const onSubmit = (data) => {
    if (isEditMode) {
      console.log('Updating product:', { ...product, ...data })
    } else {
      console.log('Creating new product:', data)
    }
    onClose()
  }
  
  if (!isOpen || !modalContainer) {
    return null
  }

  return ReactDOM.createPortal(
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
    >

      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex justify-between items-center border-b border-[#E9ECEF] pb-4">
          <h2 className="text-xl font-bold text-[#495057]">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={20} className="text-[#ADB5BD]" />
          </button>
        </div>
        
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input
                id="category"
                label="Category"
                register={register}
                rules={{ required: 'Category is required.' }}
                errors={errors}
             />
             <Input
                id="price"
                label="Price"
                type="number"
                step="0.01"
                register={register}
                rules={{ required: 'Price is required.', valueAsNumber: true }}
                errors={errors}
             />
          </div>

          <Input
            id="stock"
            label="Stock Quantity"
            type="number"
            register={register}
            rules={{ required: 'Stock is required.', valueAsNumber: true }}
            errors={errors}
          />

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
              className="px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]"
            >
              {isEditMode ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    modalContainer
  )
}

export default ProductModal