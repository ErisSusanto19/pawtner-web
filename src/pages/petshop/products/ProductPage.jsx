import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Archive, Search, ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import ProductModal from './ProductModal'
import Button from '../../../components/Button';
import { formatCurrencyIDR } from '../../../utils/formatter'
import { useDispatch, useSelector } from 'react-redux';
import { createNewProduct, deleteExistingProduct, fetchProducts, updateExistingProduct } from '../../../store/slices/productSlice';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../components/ConfirmationModal';
import clsx from 'clsx';
import Pagination from '../../../components/Pagination';
import defImg from '@/assets/undraw_images_of1m.svg'
import StarRating from '../../../components/StarRating';

const categoryOptions = [
  {value: "FOOD", label: "Food"},
  {value: "TOYS", label: "Toys"},
  {value: "ACCESSORIES", label: "Accessories"},
  {value: "HEALTH", label: "Health"},
  {value: "GROOMING_KIT", label: "Grooming Kit"}
]

const formatCategory = (category = '') => {
    return category.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
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
    const dispatch = useDispatch()
    const location = useLocation()

    const {items: products, status, error} = useSelector(state =>  state.products)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedStatus, setSelectedStatus] = useState('All')

    // const [filterIsActive, setFilterIsActive] = useState('all')// 'active', 'archived', 'all'
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 5

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [productToAction, setProductToAction] = useState(null)
    const [confirmAction, setConfirmAction] = useState({ fn: null, title: '', message: '' })
    const [isConfirmLoading, setIsConfirmLoading] = useState(false)

    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch, location])

    const filteredProductsAndSortedProducts = useMemo(() => {
        const alarmLowStock = 10
        let productList = Array.isArray(products) ? products : []
        productList = productList
            .map(p => {
                let status;
                if (p.stockQuantity === 0) status = "Out of Stock"
                else if (p.stockQuantity <= alarmLowStock) status = "Low Stock"
                else status = "In Stock"
                return { ...p, status }
            })
            .filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
                const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus

                // let matchesActiveStatus = true
                // if (filterIsActive === 'active') matchesActiveStatus = product.isActive
                // else if (filterIsActive === 'archived') matchesActiveStatus = !product.isActive
                
                return matchesSearch && matchesCategory && matchesStatus /**&& matchesActiveStatus*/
            })
        
        if (sortConfig.key !== null) {
            productList.sort((a, b) => {

                const valA = a[sortConfig.key] ?? 0;
                const valB = b[sortConfig.key] ?? 0;
                
                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return productList
    }, [products, searchTerm, selectedCategory, selectedStatus, sortConfig])

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        return filteredProductsAndSortedProducts.slice(startIndex, endIndex)
    }, [filteredProductsAndSortedProducts, currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronsUpDown size={14} className="ml-2 text-gray-400" />;
        }
        return sortConfig.direction === 'ascending' ? 
            <ArrowUp size={14} className="ml-2 text-blue-600" /> : 
            <ArrowDown size={14} className="ml-2 text-blue-600" />;
    };

    const handleCreateProduct = async (newData) => {
        try {
            const response = await dispatch(createNewProduct(newData))
            toast.success(response.message || "Product created successfully!")
        } catch (error) {
            toast.error(error.message || `Failed to create product`)
        }
    }

    const handleUpdateProduct = async (updatedData) => {
        if (!selectedProduct) return
        try {
            const response = await dispatch(updateExistingProduct({productId: selectedProduct.id, productData: updatedData}))
            toast.success(response.message || "Product updated successfully!")
        } catch (error) {
            toast.error(error.message || `Failed to update product`)
        }
    }

    const handleAddNew = () => {
        setSelectedProduct(null)
        setIsModalOpen(true)
    }

    const handleEdit = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const confirmActionHandler = async (product) => {
        if (!product) return

        setIsConfirmLoading(true)
        try {
            const response = await dispatch(deleteExistingProduct(product.id))
            toast.success(response.message || `Product "${product.name}" has been removed.`)
            
            setIsConfirmModalOpen(false)
        } catch (err) {
            toast.error(err.message || `Failed to remove product.`)
        } finally {
            setIsConfirmLoading(false)
            setProductToAction(null)
        }
    }

    const handleArchive = (product) => {
        setProductToAction(product)
        setConfirmAction({
            fn: () => confirmActionHandler(product),
            title: "Confirm Archival",
            message: `Are you sure you want to archive the product "${product.name}"? This will remove it from the active list.`
        })
        setIsConfirmModalOpen(true)
    }

    if (status === 'loading' && products.length === 0) return <div className="p-6 text-center">Loading products...</div>
    if (status === 'failed') return <div className="p-6 text-center text-red-600">{error}</div>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                    {/* <select 
                        className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white"
                        value={filterIsActive} 
                        onChange={(e) => setFilterIsActive(e.target.value)} 
                    >
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                        <option value="all">All</option>
                    </select> */}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F8F9FA] text-left text-[#495057]">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Product</th>
                                <th className="py-3 px-4 font-semibold">Category</th>
                                <th className="py-3 px-4 font-semibold cursor-pointer hover:bg-gray-200" onClick={() => requestSort('price')}>
                                    <div className="flex items-center">Price {getSortIcon('price')}</div>
                                </th>
                                <th className="py-3 px-4 font-semibold cursor-pointer hover:bg-gray-200" onClick={() => requestSort('stockQuantity')}>
                                    <div className="flex items-center">Stock {getSortIcon('stockQuantity')}</div>
                                </th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold cursor-pointer hover:bg-gray-200" onClick={() => requestSort('averageRating')}>
                                    <div className="flex items-center">Rating {getSortIcon('averageRating')}</div>
                                </th>
                                <th className="py-3 px-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.map((product) => (
                                <tr 
                                    key={product.id} 
                                    className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA] cursor-pointer"
                                    onClick={() => navigate(`/products/${product.id}`)}
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <img 
                                                src={product.imageUrl || defImg} 
                                                alt={product.name} 
                                                className="w-10 h-10 rounded-md object-cover mr-4"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = defImg;
                                                }}
                                            />
                                            <div>
                                                <p className="font-medium text-[#545F71]">{product.name}</p>
                                                <p className="text-xs text-[#ADB5BD] truncate max-w-50">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-[#495057]">{formatCategory(product.category)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{formatCurrencyIDR(product.price)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{product.stockQuantity}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {product.reviewCount > 0 ? (
                                            <div className="flex items-center gap-1.5">
                                                <StarRating rating={product.averageRating} size={16} />
                                                <span className="text-xs text-gray-500 mt-0.5">({product.reviewCount})</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">-</span>
                                        )}
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
                                                onClick={(e) => { e.stopPropagation(); handleArchive(product); }}
                                                danger={true}
                                                title="Delete Product"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredProductsAndSortedProducts.length === 0 && (
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

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => !isConfirmLoading && setIsConfirmModalOpen(false)}
                onConfirm={confirmAction.fn}
                title={confirmAction.title}
                message={confirmAction.message}
                isLoading={isConfirmLoading}
            />

            <div className="mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredProductsAndSortedProducts.length / ITEMS_PER_PAGE)}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

export default ProductsPage