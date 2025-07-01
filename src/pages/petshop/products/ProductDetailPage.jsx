import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { formatCurrencyIDR } from '../../../utils/formatter'
import { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import Button from '../../../components/Button';
import { dummyProducts, apiUpdateProduct, apiDeleteProduct } from './ProductPage'

const ProductDetailPage = () => {
    const { productId } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fectProductById = async () => {
            setLoading(true)
            setError(null)
            try {
                await new Promise(resolve => setTimeout(resolve, 1000))
                const selectedProduct = dummyProducts.find(p => p.id === productId)

                if(selectedProduct){
                    setProduct(selectedProduct)
                } else{
                    throw new Error("Product not found")
                }
            } catch (error) {
                setError(error.message)
            } finally{
                setLoading(false)
            }
        }

        fectProductById()
    }, [productId])

    const handleDelete = async (product) => {
        if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
            // await apiDeleteProduct(product.id)
            console.log("Deleting product with ID:", product.id);
            navigate('/products')
        }
    }

    const handleUpdateProduct = async (updatedData) => {
        await apiUpdateProduct(product.id, updatedData)
        setProduct(prev => ({ ...prev, ...updatedData }))
    }

    if (loading) return <div className="p-6 text-center">Loading product details...</div>
    if (error) return (
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
                    <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg object-cover" />
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
                            <p className="text-lg font-bold text-[#545F71] mt-1">{product.stock_quantity}</p>
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
        </div>
    )
}

export default ProductDetailPage