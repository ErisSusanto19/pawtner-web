import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { formatCurrencyIDR } from '../../../utils/formatter'
import { useState } from 'react';
import ProductModal from './ProductModal';
import Button from '../../../components/Button';

const dummyProducts = [
    { id: 'prod_001', name: 'Royal Canin Maxi Adult', description: 'Dry dog food for large breed adult dogs.', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'food', price: 59990, stock_quantity: 120},
    { id: 'prod_002', name: 'Catit Flower Fountain', description: 'Encourages your cat to drink more water.', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'accessories', price: 24500, stock_quantity: 45},
    { id: 'prod_003', name: 'KONG Classic Dog Toy', description: 'Durable rubber toy for chewing.', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'toys', price: 12990, stock_quantity: 8},
    { id: 'prod_004', name: 'Orijen Cat & Kitten Food', description: 'High-protein, grain-free cat food.', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'food', price: 35000, stock_quantity: 0},
    { id: 'prod_005', name: 'V-X1', description: 'blablabla.', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'health', price: 90000, stock_quantity: 0},
    { id: 'prod_006', name: 'Brush teeth', description: 'blablabla', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'grooming_kit', price: 25000, stock_quantity: 2},
]

const ProductDetailPage = () => {
    const { productId } = useParams()
    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const product = dummyProducts.find(p => p.id === productId)

    if (!product) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl text-[#495057]">Product not found.</h2>
                <Link to="/products" className="text-[#545F71] hover:underline mt-4 inline-block">
                    Back to all products
                </Link>
            </div>
        )
    }

    const handleEdit = () => {
        setIsModalOpen(true)
    }

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
            console.log("Deleting product with ID:", product.id);
            navigate('/products')
        }
    }

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
                            onClick={handleEdit}
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
                    product={product}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
}

export default ProductDetailPage