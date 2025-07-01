import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import OrderModal from './OrderModal'
import { formatDate, formatCurrencyIDR } from '../../../utils/formatter'
import { dummyOrders, apiUpdateOrderStatus, workflowStatuses } from './OrderPage'

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

const OrderDetailPage = () => {
    const { orderId } = useParams()

    const [order, setOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
    const [updateError, setUpdateError] = useState(null)

    useEffect(() => {
           const fetchOrder = async () => {
               setLoading(true)
               setError(null)
               try {
                   await new Promise(resolve => setTimeout(resolve, 1000))
                   const selectedOrder = dummyOrders.find(o => o.id == orderId)
   
                   if (selectedOrder) {
                       setOrder(selectedOrder);
                   } else {
                       throw new Error('Order not found');
                   }
               } catch (err) {
                   setError(err.message)
               } finally {
                   setLoading(false)
               }
           };
   
           fetchOrder()
       }, [orderId])

    const financials = useMemo(() => {
        if (!order) return { subtotal: 0, tax: 0 }

        const subtotal = order.items.reduce(
            (acc, item) => acc + (item.quantity * parseFloat(item.price_at_purchase)), 
            0
        )

        const shipping = parseFloat(order.shipping_cost)
        const total = parseFloat(order.total_amount)
        const tax = total - subtotal - shipping;

        return { subtotal, shipping, tax, total }
    }, [order])

    const handleStatusUpdate = async (newStatus) => {
        setIsUpdatingStatus(true)
        setUpdateError(null)
        try {
            const updatedOrderFromBackend = await apiUpdateOrderStatus(order.id, newStatus)
            setOrder(updatedOrderFromBackend)
            setIsModalOpen(false)
        } catch (err) {
            setUpdateError(err.message)
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    if (loading) return <div className="p-6 text-center">Loading order details...</div>
    if (error) return (
        <div className="p-6 text-center">
            <h2 className="text-xl text-red-600">{error}</h2>
            <Link to="/orders" className="text-[#545F71] hover:underline mt-4 inline-block">
                Back to all orders
            </Link>
        </div>
    )
    if (!order) return null

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div>
                <Link to="/orders" className="flex items-center gap-2 text-sm text-[#545F71] hover:text-[#5D6D7E] mb-4">
                    <ArrowLeft size={16} />
                    Back to Orders
                </Link>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                    <h1 className="text-2xl font-bold text-[#495057]">
                        Order Details <span className="text-[#ADB5BD]">#{order.order_number}</span>
                    </h1>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]"
                        >
                            <Edit size={16} /> Update Status
                        </button>
                         <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#495057] bg-white border border-[#E9ECEF] rounded-md hover:bg-[#F8F9FA]">
                            <Printer size={16} /> Print Invoice
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-[#495057]">Order Items ({order.items.length})</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-[#495057]">
                                <tr className="border-b border-[#E9ECEF]">
                                    <th className="py-2 px-2 font-medium">Product</th>
                                    <th className="py-2 px-2 font-medium text-center">Quantity</th>
                                    <th className="py-2 px-2 font-medium text-right">Price</th>
                                    <th className="py-2 px-2 font-medium text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={item.id || index} className="border-b border-[#E9ECEF]">
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-3">
                                                <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-md object-cover" />
                                                <span className="font-medium text-[#545F71]">{item.product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-center text-[#495057]">{item.quantity}</td>
                                        <td className="py-3 px-2 text-right text-[#495057]">{formatCurrencyIDR(item.price_at_purchase)}</td>
                                        <td className="py-3 px-2 text-right font-medium text-[#545F71]">{formatCurrencyIDR(item.price_at_purchase * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-[#495057]">Order Summary</h3>
                        <div className="flex justify-between text-sm"><span className="text-[#5D6D7E]">Order Date:</span><span className="text-[#495057] font-medium">{formatDate(order.created_at)}</span></div>
                        <div className="flex justify-between text-sm items-center"><span className="text-[#5D6D7E]">Order Status:</span><span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusBadge(order.status)}`}>{formatStatus(order.status)}</span></div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-[#495057]">Customer & Shipping</h3>
                        <p className="font-medium text-[#495057]">{order.user.name}</p>
                        <p className="text-sm text-[#5D6D7E]">{order.user.email}</p>
                        <p className="text-sm text-[#5D6D7E] pt-2 border-t border-[#E9ECEF]">{order.address}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-[#495057]">Payment Details</h3>
                        <div className="flex justify-between text-sm"><span className="text-[#5D6D7E]">Subtotal:</span><span className="text-[#495057]">{formatCurrencyIDR(financials.subtotal)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-[#5D6D7E]">Shipping:</span><span className="text-[#495057]">{formatCurrencyIDR(financials.shipping)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-[#5D6D7E]">Tax:</span><span className="text-[#495057]">{financials.tax > 0 ? formatCurrencyIDR(financials.tax) : "-"}</span></div>
                        <div className="flex justify-between text-base pt-2 border-t border-[#E9ECEF]"><span className="font-bold text-[#495057]">Total:</span><span className="font-bold text-[#495057]">{formatCurrencyIDR(financials.total)}</span></div>
                    </div>
                </div>
            </div>
            
            <OrderModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentStatus={order.status}
                onUpdate={handleStatusUpdate}
                isUpdating={isUpdatingStatus}
                updateError={updateError}
                statusOptions={workflowStatuses}
            />
        </div>
    )
}

export default OrderDetailPage