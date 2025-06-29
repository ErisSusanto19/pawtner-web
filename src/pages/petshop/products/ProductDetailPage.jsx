import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

const dummyProducts = [
    { id: 'prod_001', name: 'Royal Canin Maxi Adult', description: 'Dry dog food for large breed adult dogs.', imageUrl: 'https://via.placeholder.com/150', category: 'Dog Food', price: 59.99, stock: 120, status: 'In Stock' },
    { id: 'prod_002', name: 'Catit Flower Fountain', description: 'Encourages your cat to drink more water.', imageUrl: 'https://via.placeholder.com/150', category: 'Accessories', price: 24.50, stock: 45, status: 'In Stock' },
    { id: 'prod_003', name: 'KONG Classic Dog Toy', description: 'Durable rubber toy for chewing.', imageUrl: 'https://via.placeholder.com/150', category: 'Toys', price: 12.99, stock: 8, status: 'Low Stock' },
    { id: 'prod_004', name: 'Orijen Cat & Kitten Food', description: 'High-protein, grain-free cat food.', imageUrl: 'https://via.placeholder.com/150', category: 'Cat Food', price: 35.00, stock: 0, status: 'Out of Stock' },
]

const ProductDetailPage = () => {
    const { productId } = useParams()
    
    const product = dummyProducts.find(p => p.id === productId)

    if (!product) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl text-[#495057]">Product not found.</h2>
                <Link to="/products" className="text-[#545F71] hover:underline mt-4 inline-block">
                    Back to all products
                </Link>
            </div>
        );
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
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]">
                            <Edit size={16} /> Edit
                        </button>
                         <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700]">
                            <Trash2 size={16} /> Delete
                        </button>
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
                            <p className="text-lg font-bold text-[#545F71] mt-1">${product.price.toFixed(2)}</p>
                        </div>
                        <div>
                            <h3 className="text-xs text-[#ADB5BD] uppercase font-semibold">Stock</h3>
                            <p className="text-lg font-bold text-[#545F71] mt-1">{product.stock}</p>
                        </div>
                         <div>
                            <h3 className="text-xs text-[#ADB5BD] uppercase font-semibold">Category</h3>
                            <p className="text-[#495057] mt-1">{product.category}</p>
                        </div>
                         <div>
                            <h3 className="text-xs text-[#ADB5BD] uppercase font-semibold">Product ID</h3>
                            <p className="text-[#495057] mt-1">{product.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage