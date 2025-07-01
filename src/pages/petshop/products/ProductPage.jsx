import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import ProductModal from './ProductModal'
import Button from '../../../components/Button';
import { formatCurrencyIDR } from '../../../utils/formatter'

const categoryOptions = [
  {value: "food", label: "Food"},
  {value: "toys", label: "Toys"},
  {value: "accessories", label: "Accessories"},
  {value: "health", label: "Health"},
  {value: "grooming_kit", label: "Grooming Kit"}
]

export const dummyProducts = [
    { id: 'prod_001', name: 'Royal Canin Maxi Adult', description: 'Dry dog food for large breed adult dogs.', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'food', price: 59990, stock_quantity: 120},
    { id: 'prod_002', name: 'Catit Flower Fountain', description: 'Encourages your cat to drink more water.', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'accessories', price: 24500, stock_quantity: 45},
    { id: 'prod_003', name: 'KONG Classic Dog Toy', description: 'Durable rubber toy for chewing.', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'toys', price: 12990, stock_quantity: 8},
    { id: 'prod_004', name: 'Orijen Cat & Kitten Food', description: 'High-protein, grain-free cat food.', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'food', price: 35000, stock_quantity: 0},
    { id: 'prod_005', name: 'V-X1', description: 'blablabla.', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'health', price: 90000, stock_quantity: 0},
    { id: 'prod_006', name: 'Brush teeth', description: 'blablabla', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg', category: 'grooming_kit', price: 25000, stock_quantity: 2},
]

export const apiCreateProduct = async (newProductData) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newProduct = {
        ...newProductData,
        id: `prod_${Date.now()}`,
        imageUrl: 'https://cdn.pixabay.com/photo/2024/08/21/10/16/helenium-8985687_1280.jpg'
    };
    dummyProducts.unshift(newProduct)
    return newProduct
}

export const apiUpdateProduct = async (productId, updatedData) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const index = dummyProducts.findIndex(p => p.id === productId)
    if (index > -1) {
        dummyProducts[index] = { ...dummyProducts[index], ...updatedData }
        return dummyProducts[index]
    }
    throw new Error("Product not found for update")
}

export const apiDeleteProduct = async (productId) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const index = dummyProducts.findIndex(p => p.id === productId)
    if (index > -1) {
        dummyProducts.splice(index, 1)
        return { success: true }
    }
    throw new Error("Product not found for delete")
}

const formatCategory = (category) => {
    return category.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const getStatusBadge = (status) => {
    switch (status) {
        case 'In Stock': return "bg-green-100 text-green-800"
        case 'Low Stock': return "bg-yellow-100 text-yellow-800"
        case 'Out of Stock': return "bg-red-100 text-red-800"
        default: return "bg-gray-100 text-gray-800"
    }
};

const ProductsPage = () => {
    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedStatus, setSelectedStatus] = useState('All')

    const fetchProducts = async () => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            setProducts(dummyProducts)
        } catch (err) {
            setError('Failed to fetch product.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const filteredProducts = useMemo(() => {
        const alarmLowStock = 10

        return products
            .map(p => {
                let status;
                if (p.stock_quantity === 0) status = "Out of Stock"
                else if (p.stock_quantity <= alarmLowStock) status = "Low Stock"
                else status = "In Stock"
                return { ...p, status }
            })
            .filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
                const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus
                return matchesSearch && matchesCategory && matchesStatus
            })
    }, [products, searchTerm, selectedCategory, selectedStatus])

    const handleCreateProduct = async (newData) => {
        await apiCreateProduct(newData)
        fetchProducts()
    }

    const handleUpdateProduct = async (updatedData) => {
        if (!selectedProduct) return
        await apiUpdateProduct(selectedProduct.id, updatedData)
        fetchProducts()
    }

    const handleAddNew = () => {
        setSelectedProduct(null)
        setIsModalOpen(true)
    }

    const handleEdit = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const handleDelete = async (product) => {
        if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
            // await apiDeleteProduct(product.id)
            fetchProducts()

            console.log("Deleting product with ID:", product.id)
        }
    }

    if (loading) return <div className="p-6 text-center">Loading products...</div>
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#495057]">Product Management</h1>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057] transition-colors"
                >
                    <PlusCircle size={16} /> Add New Product
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="w-full border border-[#E9ECEF] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <select 
                        className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        
                        {categoryOptions.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                    <select 
                        className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F8F9FA] text-left text-[#495057]">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Product</th>
                                <th className="py-3 px-4 font-semibold">Category</th>
                                <th className="py-3 px-4 font-semibold">Price</th>
                                <th className="py-3 px-4 font-semibold">Stock</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr 
                                    key={product.id} 
                                    className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA] cursor-pointer"
                                    onClick={() => navigate(`/products/${product.id}`)}
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover mr-4" />
                                            <div>
                                                <p className="font-medium text-[#545F71]">{product.name}</p>
                                                <p className="text-xs text-[#ADB5BD]">{product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-[#495057]">{formatCategory(product.category)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{formatCurrencyIDR(product.price)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{product.stock_quantity}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                buttonType="button"
                                                onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                buttonType="button"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(product); }}
                                                danger={true}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-10 text-[#495057]">
                            <p>No products found matching your criteria.</p>
                        </div>
                    )}

                </div>
            </div>
            
            <ProductModal
                isOpen={isModalOpen}
                product={selectedProduct}
                onClose={() => setIsModalOpen(false)}
                onSave={selectedProduct ? handleUpdateProduct : handleCreateProduct}
            />
        </div>
    )
}

export default ProductsPage