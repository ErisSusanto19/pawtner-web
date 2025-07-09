// src/pages/petshop/products/ProductsPage.js

import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// <<< DIUBAH: Menambahkan ikon untuk sorting
import { PlusCircle, Edit, Trash2, Search, ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import ProductModal from './ProductModal';
import Button from '../../../components/Button';
import { formatCurrencyIDR } from '../../../utils/formatter';
import { useDispatch, useSelector } from 'react-redux';
import { createNewProduct, deleteExistingProduct, fetchProducts, updateExistingProduct } from '../../../store/slices/productSlice';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Pagination from '../../../components/Pagination';
import defImg from '@/assets/undraw_images_of1m.svg';
import StarRating from './components/StarRating'; // <<< BARU: Impor komponen StarRating

// ... (const categoryOptions, formatCategory, getStatusBadge tidak berubah)

const ProductsPage = () => {
    // ... (Hooks: navigate, dispatch, location, useSelector tidak berubah)
    const { items: products, status, error } = useSelector(state => state.products);

    // ... (State lama tidak berubah)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [productToAction, setProductToAction] = useState(null);
    const [confirmAction, setConfirmAction] = useState({ fn: null, title: '', message: '' });
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);

    // <<< BARU: State untuk mengelola konfigurasi sorting
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // <<< DIUBAH: Mengganti nama `filteredProducts` menjadi `filteredAndSortedProducts`
    // dan menambahkan logika sorting di dalamnya.
    const filteredAndSortedProducts = useMemo(() => {
        const alarmLowStock = 10;
        let productList = Array.isArray(products) ? products : [];

        // Langkah 1: Tambahkan status (logika ini sudah ada sebelumnya)
        productList = productList.map(p => {
            let status;
            if (p.stockQuantity === 0) status = "Out of Stock";
            else if (p.stockQuantity <= alarmLowStock) status = "Low Stock";
            else status = "In Stock";
            return { ...p, status };
        });

        // Langkah 2: Filter (logika ini sudah ada sebelumnya)
        productList = productList.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;
            return matchesSearch && matchesCategory && matchesStatus;
        });

        // <<< BARU: Langkah 3: Logika Sorting ditambahkan di sini
        if (sortConfig.key !== null) {
            productList.sort((a, b) => {
                // Gunakan 0 jika nilai null/undefined untuk averageRating
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

        return productList;
    }, [products, searchTerm, selectedCategory, selectedStatus, sortConfig]); // <<< DIUBAH: Tambahkan sortConfig ke dependency array

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        // <<< DIUBAH: Menggunakan `filteredAndSortedProducts`
        return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedProducts, currentPage]); // <<< DIUBAH: Menggunakan `filteredAndSortedProducts`

    // ... (Fungsi handler lama tidak berubah)
    const handlePageChange = (page) => { setCurrentPage(page); };
    // ... (handleCreateProduct, handleUpdateProduct, dll)
    
    // <<< BARU: Fungsi untuk menangani permintaan sorting saat header kolom diklik
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1); // Kembali ke halaman pertama setelah sorting
    };

    // <<< BARU: Fungsi helper untuk menampilkan ikon sorting yang benar
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronsUpDown size={14} className="ml-2 text-gray-400" />;
        }
        return sortConfig.direction === 'ascending' ? 
            <ArrowUp size={14} className="ml-2 text-blue-600" /> : 
            <ArrowDown size={14} className="ml-2 text-blue-600" />;
    };
    
    // ... (Bagian return JSX)
    if (status === 'loading' && products.length === 0) return <div className="p-6 text-center">Loading products...</div>;
    if (status === 'failed') return <div className="p-6 text-center text-red-600">{error}</div>;

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            {/* Header dan Filter tidak ada perubahan signifikan */}
            {/* ... */}
            
            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                 {/* ... (Kontrol filter tidak berubah) ... */}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F8F9FA] text-left text-[#495057]">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Product</th>
                                <th className="py-3 px-4 font-semibold">Category</th>
                                {/* <<< DIUBAH: Menambahkan onClick dan ikon sorting */}
                                <th className="py-3 px-4 font-semibold cursor-pointer hover:bg-gray-200" onClick={() => requestSort('price')}>
                                    <div className="flex items-center">Price {getSortIcon('price')}</div>
                                </th>
                                {/* <<< DIUBAH: Menambahkan onClick dan ikon sorting */}
                                <th className="py-3 px-4 font-semibold cursor-pointer hover:bg-gray-200" onClick={() => requestSort('stockQuantity')}>
                                    <div className="flex items-center">Stock {getSortIcon('stockQuantity')}</div>
                                </th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                {/* <<< BARU: Kolom Rating ditambahkan dan bisa di-sort */}
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
                                    {/* ... (<td> Product, Category, Price, Stock, Status tidak berubah) ... */}
                                    <td className="py-3 px-4">
                                        {/* ... <td> Product ... */}
                                    </td>
                                    <td className="py-3 px-4 text-[#495057]">{formatCategory(product.category)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{formatCurrencyIDR(product.price)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{product.stockQuantity}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>

                                    {/* <<< BARU: Sel data <td> untuk menampilkan Rating */}
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
                                        {/* ... (<td> Actions tidak berubah) ... */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* <<< DIUBAH: Menggunakan `filteredAndSortedProducts` untuk mengecek panjang array */}
                    {filteredAndSortedProducts.length === 0 && (
                        <div className="text-center py-10 text-[#495057]">
                            <p>No products found matching your criteria.</p>
                        </div>
                    )}

                </div>
            </div>
            
            {/* ... (Modal tidak berubah) ... */}

            <div className="mt-6">
                {/* <<< DIUBAH: Menggunakan `filteredAndSortedProducts` untuk menghitung total halaman */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default ProductsPage;