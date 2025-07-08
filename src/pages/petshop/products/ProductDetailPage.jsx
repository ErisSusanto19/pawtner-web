import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { formatCurrencyIDR } from '../../../utils/formatter'
import { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import Button from '../../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { deleteExistingProduct, fetchProductById, setCurrentProduct, updateExistingProduct } from '../../../store/slices/productSlice';
import { toast } from 'react-toastify';
import defImg from '@/assets/undraw_images_of1m.svg'

const ProductDetailPage = () => {
    const { productId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { currentItem: product, status, error } = useSelector(state => state.products)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

     useEffect(() => {
        if (!product || product.id !== productId) {
            dispatch(fetchProductById(productId))
        }

        return () => {
            dispatch(setCurrentProduct(null))
        }
    }, [productId, dispatch])

    const handleDelete = () => {
        setIsConfirmModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!product) return
        try {
            const response = await dispatch(deleteExistingProduct(product.id))
            toast.success(response.message || `Product "${product.name}" deleted successfully!`)
            navigate('/products')
        } catch (err) {
            toast.error(err.message || 'Failed to delete product.')
        } finally {
            setIsConfirmModalOpen(false)
        }
    }

    const handleUpdateProduct = async (updatedData) => {
        if (!product) return
        await dispatch(updateExistingProduct({ productId: product.id, productData: updatedData }))
    }

    if (status == 'loading' && !product) return <div className="p-6 text-center">Loading product details...</div>
    if (status == 'failed' && error) return (
        <div className="p-6 text-center">
            <h2 className="text-xl text-red-600">{error}</h2>
            <Link to="/products" className="text-[#545F71] hover:underline mt-4 inline-block">
                Back to all products
            </Link>
        </div>
    )
    if (!product) return null

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">

            <div>
                <Link to="/products" className="flex items-center gap-2 text-sm text-[#545F71] hover:text-blue-600 mb-4">
                    <ArrowLeft size={16} />
                    Back to Products
                </Link>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[#495057]">{product.name}</h1>
                    <div className="flex gap-2">
                        <Button
                            buttonType="button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Edit size={16} /> Edit
                        </Button>
                        <Button
                            buttonType="button"
                            onClick={handleDelete}
                            danger={true}
                        >
                            <Trash2 size={16} /> Delete
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] grid grid-cols-1 md:grid-cols-3 gap-8 p-6">

                <div className="md:col-span-1">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-auto rounded-lg object-cover"
                        onError={(e) => {
                            e.target.onerror = null
                            e.target.src = defImg
                        }}
                    />
                </div>

                <div className="md:col-span-2 space-y-4">
                    <div>
                        <h3 className="text-xs text-[#ADB5BD] uppercase font-semibold">Description</h3>
                        <p className="text-[#495057] mt-1">{product.description}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-[#E9ECEF] pt-4">
                        <div>
                            <h3 className="text-xs text-[#ADB5BD] uppercase font-semibold">Price</h3>
                            <p className="text-lg font-bold text-[#545F71] mt-1">{formatCurrencyIDR(product.price)}</p>
                        </div>
                        <div>
                            <h3 className="text-xs text-[#ADB5BD] uppercase font-semibold">Stock</h3>
                            <p className="text-lg font-bold text-[#545F71] mt-1">{product.stockQuantity}</p>
                        </div>
                         <div>
                            <h3 className="text-xs text-[#ADB5BD] uppercase font-semibold">Category</h3>
                            <p className="text-[#495057] mt-1">{product?.category? product.category.replace('-', ' ').charAt(0).toUpperCase() + product.category.slice(1) : ""}</p>
                        </div>
                         <div>
                            <h3 className="text-xs text-[#ADB5BD] uppercase font-semibold">Product ID</h3>
                            <p className="text-[#495057] mt-1">{product.id}</p>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ProductModal 
                    isOpen={isModalOpen}
                    product={product}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleUpdateProduct}
                />
            )}

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to delete the product "${product?.name}"? This action cannot be undone.`}
            />
        </div>
    )
}

export default ProductDetailPage