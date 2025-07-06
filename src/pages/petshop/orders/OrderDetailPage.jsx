import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import OrderModal from './OrderModal';
import { formatCurrencyIDR, formatDate } from '../../../utils/formatter';
import { fetchOrderById, clearCurrentOrder, changeOrderStatus } from '../../../store/slices/orderSlice'; // Pastikan path benar
import { toast } from 'react-toastify';

// Helper & Konstanta
const formatStatus = (status = '') => {
    if (!status) return '';
    return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
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

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();

    const { currentOrder: order, status, error } = useSelector(state => state.orders);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderById(orderId));
        }
        return () => {
            dispatch(clearCurrentOrder());
        };
    }, [orderId, dispatch]);

    const financials = useMemo(() => {
        if (!order) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
        const subtotal = order.items?.reduce((acc, item) => acc + (item.quantity * parseFloat(item.priceAtPurchase)), 0) || 0;
        const shipping = parseFloat(order.shippingCost || 0);
        const total = parseFloat(order.totalAmount || 0);
        const tax = total - subtotal - shipping;
        return { subtotal, shipping, tax, total };
    }, [order]);

    const handleStatusUpdate = async (newStatus) => {
        setIsUpdatingStatus(true);
        try {
            await dispatch(changeOrderStatus({ orderId: order.id, payload: { status: newStatus } })).unwrap();
            toast.success("Order status updated successfully!");
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to update status.");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    if (status === 'loading' && !order) return <div className="p-6 text-center">Loading order details...</div>;
    if (status === 'failed' && !order) return <div className="p-6 text-center text-red-600"><h2>{error}</h2><Link to="/orders" className="text-[#545F71] hover:underline mt-4 inline-block">Back to all orders</Link></div>;
    if (!order) return null;

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div>
                <Link to="/orders" className="flex items-center gap-2 text-sm text-[#545F71] hover:text-[#5D6D7E] mb-4"><ArrowLeft size={16} />Back to Orders</Link>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                    <h1 className="text-2xl font-bold text-[#495057]">Order Details <span className="text-[#ADB5BD]">#{order.orderNumber}</span></h1>
                    <div className="flex gap-2">
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]"><Edit size={16} /> Update Status</button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#495057] bg-white border border-[#E9ECEF] rounded-md hover:bg-[#F8F9FA]"><Printer size={16} /> Print Invoice</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-[#495057]">Order Items ({order.items?.length || 0})</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-[#495057]"><tr className="border-b border-[#E9ECEF]"><th className="py-2 px-2 font-medium">Product</th><th className="py-2 px-2 font-medium text-center">Quantity</th><th className="py-2 px-2 font-medium text-right">Price</th><th className="py-2 px-2 font-medium text-right">Subtotal</th></tr></thead>
                            <tbody>
                                {order.items?.map((item, index) => (
                                    <tr key={item.id || index} className="border-b border-[#E9ECEF]">
                                        <td className="py-3 px-2"><div className="flex items-center gap-3"><img src={item.product?.imageUrl} alt={item.product?.name} className="w-12 h-12 rounded-md object-cover" /><span className="font-medium text-[#545F71]">{item.product?.name}</span></div></td>
                                        <td className="py-3 px-2 text-center text-[#495057]">{item.quantity}</td>
                                        <td className="py-3 px-2 text-right text-[#495057]">{formatCurrencyIDR(item.priceAtPurchase)}</td>
                                        <td className="py-3 px-2 text-right font-medium text-[#545F71]">{formatCurrencyIDR(item.priceAtPurchase * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-[#495057]">Order Summary</h3>
                        <div className="flex justify-between text-sm"><span className="text-[#5D6D7E]">Order Date:</span><span className="text-[#495057] font-medium">{formatDate(order.createdAt)}</span></div>
                        <div className="flex justify-between text-sm items-center"><span className="text-[#5D6D7E]">Order Status:</span><span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusBadge(order.status)}`}>{formatStatus(order.status)}</span></div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-[#495057]">Customer & Shipping</h3>
                        <p className="font-medium text-[#495057]">{order.customer?.name}</p>
                        <p className="text-sm text-[#5D6D7E]">{order.customer?.email}</p>
                        <p className="text-sm text-[#5D6D7E] pt-2 border-t border-[#E9ECEF]">{order.shippingAddress?.fullAddress}</p>
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
            
            <OrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} currentStatus={order.status} onUpdate={handleStatusUpdate} isUpdating={isUpdatingStatus} statusOptions={workflowStatuses} />
        </div>
    )
}

export default OrderDetailPage