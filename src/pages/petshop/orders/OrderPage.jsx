import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Eye, MoreVertical, Edit, Printer, XCircle, Undo2, ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrencyIDR, formatDate } from '../../../utils/formatter';
import Button from '../../../components/Button';
import OrderModal from './OrderModal';
import { fetchBusinessOrders, changeOrderStatus } from '../../../store/slices/orderSlice';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Pagination from '../../../components/Pagination'
import PageLoader from '../../../components/PageLoader';

const formatStatus = (status = '') => {
    if (!status) return '';
    return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
};

const getOrderStatusBadge = (status) => {
    switch (status) {
        case 'COMPLETED': return "bg-green-100 text-green-800";
        case 'SHIPPED': return "bg-blue-100 text-blue-800";
        case 'PROCESSING': return "bg-purple-100 text-purple-800";
        case 'PENDING_PAYMENT': return "bg-yellow-100 text-yellow-800";
        case 'CANCELLED': return "bg-red-100 text-red-800";
        case 'FAILED': return "bg-red-200 text-red-900";
        case 'REFUNDED': return "bg-gray-200 text-gray-800";
        default: return "bg-gray-100 text-gray-800";
    }
};

const workflowStatuses = [
    { value: "PENDING_PAYMENT", label: "Pending Payment" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "COMPLETED", label: "Completed" },
];

const OrderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { items: orders, status, error } = useSelector(state => state.orders)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [menuState, setMenuState] = useState({ isOpen: false, orderId: null, position: {} })
    const menuRef = useRef(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('ALL')
    const [isUpdating, setIsUpdating] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [confirmAction, setConfirmAction] = useState({ fn: null, title: '', message: '' })

    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5

    useEffect(() => {
        dispatch(fetchBusinessOrders({ page: 0, size: 50 }));
    }, [dispatch]);

    useEffect(() => {
        if (status === 'failed' && orders.length > 0) {
            toast.error(`Failed to refresh orders: ${error}`)
        }
    }, [status, error, orders.length])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuState({ isOpen: false, orderId: null, position: {} })
            }
        };
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, []);

    const filteredAndSortedOrders = useMemo(() => {
        let orderList = Array.isArray(orders) ? [...orders] : []
        orderList = orderList.filter(order => {
            const searchPool = `${order.orderNumber} ${order.customer?.name} ${order.customer?.email}`.toLowerCase();
            const matchesSearch = searchPool.includes(searchTerm.toLowerCase())
            const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus
            return matchesSearch && matchesStatus;
        })

        if (sortConfig.key !== null) {
            orderList.sort((a, b) => {
                const valA = a[sortConfig.key] ?? '';
                const valB = b[sortConfig.key] ?? '';
                
                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return orderList
    }, [searchTerm, selectedStatus, orders, sortConfig])

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredAndSortedOrders.slice(startIndex, endIndex);
    }, [filteredAndSortedOrders, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1)
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronsUpDown size={14} className="ml-2 text-gray-400" />;
        }
        return sortConfig.direction === 'ascending' ? 
            <ArrowUp size={14} className="ml-2 text-blue-600" /> : 
            <ArrowDown size={14} className="ml-2 text-blue-600" />;
    };
    
    const handleMenuOpen = (e, orderId) => {
        e.stopPropagation()
        const rect = e.currentTarget.getBoundingClientRect()
        setMenuState({
            isOpen: menuState.orderId !== orderId,
            orderId: menuState.orderId !== orderId ? orderId : null,
            position: {
                top: rect.bottom + window.scrollY + 5,
                left: rect.right + window.scrollX - 208
            }
        })
    }

    const handleOpenUpdateModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
        setMenuState({ isOpen: false, orderId: null, position: {} })
    }

    const handleConfirmAction = (order, newStatus, title, message) => {
        setConfirmAction({
            fn: async () => {
                setIsUpdating(true)
                try {
                    await dispatch(changeOrderStatus({ orderId: order.id, payload: { status: newStatus } }))
                    toast.success(`Order marked as ${formatStatus(newStatus)}.`);
                } catch (err) {
                    toast.error(err.message || "Failed to update status.");
                } finally {
                    setIsUpdating(false);
                    setIsConfirmOpen(false);
                }
            },
            title,
            message,
        })
        setIsConfirmOpen(true)
        setMenuState({ isOpen: false, orderId: null, position: {} })
    }
    
    const handleStatusUpdateInModal = async (newStatus) => {
        if (!selectedOrder) return
        setIsUpdating(true)
        try {
            await dispatch(changeOrderStatus({ orderId: selectedOrder.id, payload: { status: newStatus } }))
            toast.success("Order status updated successfully!")
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to update status.")
        } finally {
            setIsUpdating(false);
        }
    };

    if (status === 'loading' && orders.length === 0) return <PageLoader message="Loading orders..."/>
    if (status === 'failed' && orders.length === 0) {
        return <div className="p-6 text-center text-red-600">Error loading orders: {error}</div>
    }

    const allStatuses = ['ALL', 'PENDING_PAYMENT', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'FAILED', 'REFUNDED'];

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <h1 className="text-2xl font-bold text-[#495057]">Order Management</h1>
            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative md:col-span-2">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
                        <input type="text" placeholder="Search by Order ID, Customer Name, or Email..." className="w-full border border-[#E9ECEF] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <select className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        {allStatuses.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : formatStatus(s)}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F8F9FA] text-left text-[#495057]">
                            <tr>
                                <th className="py-3 px-4 font-semibold text-center">#</th>
                                <th className="py-3 px-4 font-semibold">Order ID</th>
                                <th className="py-3 px-4 font-semibold">Customer</th>
                                <th className="py-3 px-4 font-semibold cursor-pointer hover:bg-gray-200" onClick={() => requestSort('createdAt')}>
                                    <div className="flex items-center">Date {getSortIcon('createdAt')}</div>
                                </th>
                                <th className="py-3 px-4 font-semibold cursor-pointer hover:bg-gray-200" onClick={() => requestSort('totalAmount')}>
                                    <div className="flex items-center">Total {getSortIcon('totalAmount')}</div>
                                </th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.map((order, index) => (
                                <tr key={order.id} className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA] cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                                    <td className="py-3 px-4 text-center text-[#495057]">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                    </td>
                                    <td className="py-3 px-4 font-medium text-[#545F71]">{order.orderNumber}</td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="font-medium text-[#5D6D7E]">{order.customerName}</p>
                                            <p className="text-xs text-[#ADB5BD]">{order.customer?.email}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-[#495057]">{formatDate(order.createdAt)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{formatCurrencyIDR(order.totalAmount)}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusBadge(order.status)}`}>
                                            {formatStatus(order.status)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center items-center gap-2">
                                            {/* <Button buttonType="button" onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }} title="View Details"><Eye size={16} /></Button> */}
                                            <Button buttonType="button" onClick={(e) => handleMenuOpen(e, order.id)} secondary={true} title="More Actions"><MoreVertical size={16} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredAndSortedOrders.length === 0 && (
                        <div className="text-center py-10 text-[#495057]">
                            <p>No orders found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {menuState.isOpen && (
                <div ref={menuRef} className="fixed w-52 bg-white rounded-md shadow-lg border z-50" style={{ top: `${menuState.position.top}px`, left: `${menuState.position.left}px` }}>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleOpenUpdateModal(orders.find(o => o.id === menuState.orderId)); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Edit size={14} /> Update Workflow</a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Printer size={14} /> Print Invoice</a>
                    {['PENDING_PAYMENT', 'PROCESSING'].includes(orders.find(o => o.id === menuState.orderId)?.status) && (
                        <a href="#" onClick={(e) => { e.preventDefault(); handleConfirmAction(orders.find(o => o.id === menuState.orderId), 'CANCELLED', 'Confirm Cancellation', `Are you sure you want to CANCEL order ${orders.find(o => o.id === menuState.orderId).orderNumber}?`); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><XCircle size={14} /> Cancel Order</a>
                    )}
                    {orders.find(o => o.id === menuState.orderId)?.status === 'COMPLETED' && (
                        <a href="#" onClick={(e) => { e.preventDefault(); handleConfirmAction(orders.find(o => o.id === menuState.orderId), 'REFUNDED', 'Confirm Refund', `Initiate a refund for order ${orders.find(o => o.id === menuState.orderId).orderNumber}?`); }} className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"><Undo2 size={14} /> Issue Refund</a>
                    )}
                </div>
            )}
            
            <OrderModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                currentStatus={selectedOrder?.status} 
                onUpdate={handleStatusUpdateInModal} 
                isUpdating={isUpdating} 
                statusOptions={workflowStatuses} 
            />

            <ConfirmationModal 
                isOpen={isConfirmOpen} 
                onClose={() => setIsConfirmOpen(false)} 
                onConfirm={confirmAction.fn} 
                title={confirmAction.title} 
                message={confirmAction.message} 
                isLoading={isUpdating} 
            />

            <div className="mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredAndSortedOrders.length / ITEMS_PER_PAGE)}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

export default OrderPage