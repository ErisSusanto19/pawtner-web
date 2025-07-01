import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, MoreVertical, Edit, Printer, XCircle, Undo2 } from 'lucide-react';
import { formatCurrencyIDR, formatDate } from '../../../utils/formatter'
import Button from '../../../components/Button'
import OrderModal from './OrderModal';

export const dummyOrders = [
    { 
        id: 1,
        order_number: 'ORD-2023-1024',
        user: { name: 'Budi Hartono', email: 'budi.h@example.com' }, 
        created_at: '2023-10-26T14:30:00Z', 
        total_amount: '87010',  
        status: 'completed', 
        address: 'Jl. Merdeka No. 17, Jakarta Pusat, DKI Jakarta, 10110',
        special_instructions: 'Tolong letakkan paket di depan pintu.',
        shipping_cost: '2520.00',
        items: [
            { 
                product: { id: 'prod_001', name: 'Royal Canin Maxi Adult', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg' },
                quantity: 1,
                price_at_purchase: '59990.00'
            },
            { 
                product: { id: 'prod_002', name: 'KONG Classic Dog Toy', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg' },
                quantity: 1,
                price_at_purchase: '24500.00'
            },
        ]
    },
    { 
        id: 2,
        order_number: 'ORD-2023-1023',
        user: { name: 'Citra Lestari', email: 'citra.l@example.com' }, 
        created_at: '2023-10-25T11:00:00Z',
        total_amount: '35000', 
        status: 'shipped',
        address: 'Jl. Pahlawan No. 45, Surabaya, Jawa Timur, 60271',
        special_instructions: 'Tolong letakkan paket di depan pintu.',
        shipping_cost: '0',
        items: [
            {
                product: { id: 'prod_004', name: 'Orijen Cat & Kitten Food', imageUrl: 'https://cdn.pixabay.com/photo/2024/07/30/13/57/plums-8932336_1280.jpg'},
                quantity: 1,
                price_at_purchase: '35000'
            }
            
        ],
    },
]

export const apiUpdateOrderStatus = async (orderId, newStatus) => {
    console.log(`[API MOCK] Mengirim permintaan untuk update order ${orderId} ke status: ${newStatus}`)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const orderIndex = dummyOrders.findIndex(o => o.id == orderId)
    if (orderIndex !== -1) {
        dummyOrders[orderIndex].status = newStatus
        return dummyOrders[orderIndex]
    } else {
        throw new Error("Gagal memperbarui status: Pesanan tidak ditemukan.")
    }
}

const apiIssueRefund = async (orderId) => {
    console.log(`[API MOCK] Memproses refund untuk order ${orderId}`)
    await new Promise(resolve => setTimeout(resolve, 800))
    const index = dummyOrders.findIndex(p => p.id === orderId)
    if (index > -1) {
        dummyOrders[index].status = 'refunded'
        return dummyOrders[index];
    }
    throw new Error("Order not found for refund")
}

export const terminalStatuses = [
    {value: "cancelled", label: "Cancelled"},
    {value: "failed", label: "Failed"},
    {value: "refunded", label: "Refunded"}
]

export const workflowStatuses = [
    {value: "completed", label: "Completed"},
    {value: "shipped", label: "Shipped"},
    {value: "processing", label: "Processing"},
    {value: "pending_payment", label: "Pending Payment"}
]

const allStatusOptions = [...workflowStatuses, terminalStatuses]

const formatStatus = (status) => {
    return status.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const getOrderStatusBadge = (status) => {
    switch (status) {
        case 'completed': return "bg-green-100 text-green-800"
        case 'shipped': return "bg-blue-100 text-blue-800"
        case 'processing': return "bg-purple-100 text-purple-800"
        case 'pending_payment': return "bg-yellow-100 text-yellow-800"
        case 'cancelled': return "bg-red-100 text-red-800"
        case 'failed': return "bg-red-200 text-red-900"
        case 'refunded': return "bg-gray-200 text-gray-800"
        default: return "bg-gray-100 text-gray-800"
    }
}

const OrderPage = () => {
    const navigate = useNavigate()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)

    const [menuState, setMenuState] = useState({ isOpen: false, orderId: null, position: { top: 0, left: 0 } });
    const menuRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('All')

    const fetchOrders = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setOrders(dummyOrders)
        } catch (err) {
            setError('Failed to fetch orders.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

     useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuState({ isOpen: false, orderId: null, position: {} })
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = 
                order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
            
            const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus

            return matchesSearch && matchesStatus
        })
    }, [searchTerm, selectedStatus, orders])

    const handleMenuOpen = (e, order) => {
        e.stopPropagation()
        const rect = e.currentTarget.getBoundingClientRect()
        setMenuState({
            isOpen: menuState.orderId !== order.id,
            orderId: menuState.orderId !== order.id ? order.id : null,
            position: {
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 208
            }
        })
    }

    const closeMenu = () => setMenuState({ isOpen: false, orderId: null, position: {} })

    const statuses = ['All', 'pending_payment', 'processing', 'shipped', 'completed', 'cancelled', 'failed', 'refunded']

    const handleOpenUpdateModal = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
        setMenuOpen(null)
    }

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedOrder) return
        await apiUpdateOrderStatus(selectedOrder.id, newStatus)
        fetchOrders()
    }

    const handleCancel = async (order) => {
        if (window.confirm(`Are you sure you want to CANCEL order ${order.order_number}?`)) {
            await apiUpdateOrderStatus(order.id, 'cancelled')
            fetchOrders()
        }
        setMenuOpen(null)
    }

    const handleRefund = async (order) => {
        if (window.confirm(`Initiate a refund process for order ${order.order_number}?`)) {
            await apiIssueRefund(order.id)
            fetchOrders()
        }
        setMenuOpen(null)
    }

    if (loading) return <div className="p-6 text-center">Loading orders...</div>
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">

            <div className="flex justify-between items-center relative">
                <h1 className="text-2xl font-bold text-[#495057]">Order Management</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative md:col-span-2">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
                        <input 
                            type="text" 
                            placeholder="Search by Order ID, Customer Name, or Email..." 
                            className="w-full border border-[#E9ECEF] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        {statuses.map(status => <option key={status} value={status}>{status === 'All' ? 'All Status' : status}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F8F9FA] text-left text-[#495057]">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Order ID</th>
                                <th className="py-3 px-4 font-semibold">Customer</th>
                                <th className="py-3 px-4 font-semibold">Date</th>
                                <th className="py-3 px-4 font-semibold">Total</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr 
                                    key={order.id} 
                                    className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA] cursor-pointer"
                                    onClick={() => navigate(`/orders/${order.id}`)}
                                >
                                    <td className="py-3 px-4 font-medium text-[#545F71]">{order.order_number}</td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="font-medium text-[#5D6D7E]">{order.user.name}</p>
                                            <p className="text-xs text-[#ADB5BD]">{order.user.email}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-[#495057]">{formatDate(order.created_at)}</td>
                                    <td className="py-3 px-4 text-[#495057]">{formatCurrencyIDR(order.total_amount)}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusBadge(order.status)}`}>
                                            {formatStatus(order.status)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center items-center gap-2">
                                            <Button
                                                buttonType="button"
                                                onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </Button>

                                            <Button
                                                buttonType="button"
                                                onClick={(e) => handleMenuOpen(e, order)}
                                                secondary={true}
                                                title="More Actions"
                                            >
                                                <MoreVertical size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredOrders.length === 0 && (
                        <div className="text-center py-10 text-[#495057]">
                            <p>No orders found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {menuState.isOpen && (
                <div 
                    ref={menuRef} 
                    className="fixed w-52 bg-white rounded-md shadow-lg border z-50"
                    style={{ top: `${menuState.position.top}px`, left: `${menuState.position.left}px` }}
                >
                    <a href="#" onClick={(e) => { e.preventDefault(); handleOpenUpdateModal(orders.find(o => o.id == menuState.orderId)); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Edit size={14} /> Update Workflow
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Printer size={14} /> Print Invoice
                    </a>
                    {/* Logika kondisional tetap sama */}
                    {['pending_payment', 'processing'].includes(orders.find(o => o.id === menuState.orderId)?.status) && (
                        <a href="#" onClick={(e) => { e.preventDefault(); handleCancel(orders.find(o => o.id === menuState.orderId)); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <XCircle size={14} /> Cancel Order
                        </a>
                    )}
                    {orders.find(o => o.id === menuState.orderId)?.status === 'completed' && (
                        <a href="#" onClick={(e) => { e.preventDefault(); handleRefund(orders.find(o => o.id === menuState.orderId)); }} className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                            <Undo2 size={14} /> Issue Refund
                        </a>
                    )}
                </div>
            )}

            {selectedOrder && (
                <OrderModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    currentStatus={selectedOrder.status}
                    onUpdate={handleStatusUpdate}
                    statusOptions={workflowStatuses}
                />
            )}
        </div>
    )
}

export default OrderPage