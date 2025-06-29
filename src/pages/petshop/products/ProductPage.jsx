import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import ProductModal from './ProductModal'

const dummyProducts = [
    { id: 'prod_001', name: 'Royal Canin Maxi Adult', description: 'Dry dog food for large breed adult dogs.', imageUrl: 'https://via.placeholder.com/150', category: 'Dog Food', price: 59.99, stock: 120, status: 'In Stock' },
    { id: 'prod_002', name: 'Catit Flower Fountain', description: 'Encourages your cat to drink more water.', imageUrl: 'https://via.placeholder.com/150', category: 'Accessories', price: 24.50, stock: 45, status: 'In Stock' },
    { id: 'prod_003', name: 'KONG Classic Dog Toy', description: 'Durable rubber toy for chewing.', imageUrl: 'https://via.placeholder.com/150', category: 'Toys', price: 12.99, stock: 8, status: 'Low Stock' },
    { id: 'prod_004', name: 'Orijen Cat & Kitten Food', description: 'High-protein, grain-free cat food.', imageUrl: 'https://via.placeholder.com/150', category: 'Cat Food', price: 35.00, stock: 0, status: 'Out of Stock' },
]

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

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedStatus, setSelectedStatus] = useState('All')

    const filteredProducts = useMemo(() => {
        return dummyProducts.filter(product => {
    
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

            const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [searchTerm, selectedCategory, selectedStatus])

    const categories = ['All', ...new Set(dummyProducts.map(p => p.category))]

    const handleAddNew = () => {
        setSelectedProduct(null)
        setIsModalOpen(true)
    }

    const handleEdit = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

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
                        {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
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
                                    <td className="py-3 px-4 text-[#495057]">{product.category}</td>
                                    <td className="py-3 px-4 text-[#495057]">${product.price.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{product.stock}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                                                className="p-1 text-[#545F71] hover:text-blue-600"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); console.log('Delete', product.id); }}
                                                className="p-1 text-[#545F71] hover:text-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
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
                onClose={() => setIsModalOpen(false)} 
                product={selectedProduct} 
            />
        </div>
    )
}

export default ProductsPage