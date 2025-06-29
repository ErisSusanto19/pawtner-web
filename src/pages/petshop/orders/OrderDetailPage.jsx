import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import OrderModal from './OrderModal'

const dummyOrders = [
    { 
        id: 'order_1024', 
        customer: { name: 'Budi Hartono', email: 'budi.h@example.com' }, 
        date: '2023-10-26', 
        status: 'Delivered', 
        shippingAddress: 'Jl. Merdeka No. 17, Jakarta Pusat, DKI Jakarta, 10110',
        items: [
            { id: 'prod_001', name: 'Royal Canin Maxi Adult', imageUrl: 'https://via.placeholder.com/150', price: 59.99, quantity: 1 },
            { id: 'prod_003', name: 'KONG Classic Dog Toy', imageUrl: 'https://via.placeholder.com/150', price: 12.99, quantity: 1 },
        ],
        subtotal: 72.98,
        shipping: 2.52,
        tax: 0.00,
        total: 75.50,
    },
    { 
        id: 'order_1022', 
        customer: { name: 'Ahmad Dahlan', email: 'ahmad.d@example.com' }, 
        date: '2023-10-25', 
        status: 'Processing',
        shippingAddress: 'Jl. Pahlawan No. 45, Surabaya, Jawa Timur, 60271',
        items: [
            { id: 'prod_004', name: 'Orijen Cat & Kitten Food', imageUrl: 'https://via.placeholder.com/150', price: 35.00, quantity: 3 },
            { id: 'prod_002', name: 'Catit Flower Fountain', imageUrl: 'https://via.placeholder.com/150', price: 24.50, quantity: 1 },
        ],
        subtotal: 129.50,
        shipping: 0.00,
        tax: 5.50,
        total: 135.00,
    },
]

const getOrderStatusBadge = (status) => {
    switch (status) {
        case 'Delivered': return "bg-green-100 text-green-800"
        case 'Shipped': return "bg-blue-100 text-blue-800"
        case 'Processing': return "bg-purple-100 text-purple-800"
        case 'Pending': return "bg-yellow-100 text-yellow-800"
        case 'Cancelled': return "bg-red-100 text-red-800"
        default: return "bg-gray-100 text-gray-800"
    }
};

const OrderDetailPage = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()

    const [order, setOrder] = useState(dummyOrders.find(o => o.id === orderId))
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!order) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl text-[#495057]">Order not found.</h2>
                <Link to="/orders" className="text-[#545F71] hover:underline mt-4 inline-block">
                    Back to all orders
                </Link>
            </div>
        );
    }

    const handleStatusUpdate = (newStatus) => {
        console.log(`Updating order ${order.id} to ${newStatus}`);
        setOrder(prevOrder => ({ ...prevOrder, status: newStatus }));
        setIsModalOpen(false);
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div>
                <Link to="/orders" className="flex items-center gap-2 text-sm text-[#545F71] hover:text-[#5D6D7E] mb-4">
                    <ArrowLeft size={16} />
                    Back to Orders
                </Link>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                    <h1 className="text-2xl font-bold text-[#495057]">
                        Order Details <span className="text-[#ADB5BD]">#{order.id.split('_')[1]}</span>
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
                                {order.items.map(item => (
                                    <tr key={item.id} className="border-b border-[#E9ECEF]">
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-3">
                                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                                                <span className="font-medium text-[#545F71]">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-center text-[#495057]">{item.quantity}</td>
                                        <td className="py-3 px-2 text-right text-[#495057]">${item.price.toFixed(2)}</td>
                                        <td className="py-3 px-2 text-right font-medium text-[#545F71]">${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-[#495057]">Order Summary</h3>
                        <div className="flex justify-between text-sm"><span className="text-[#5D6D7E]">Order Date:</span><span className="text-[#495057] font-medium">{order.date}</span></div>
                        <div className="flex justify-between text-sm items-center"><span className="text-[#5D6D7E]">Order Status:</span><span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusBadge(order.status)}`}>{order.status}</span></div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-[#495057]">Customer & Shipping</h3>
                        <p className="font-medium text-[#495057]">{order.customer.name}</p>
                        <p className="text-sm text-[#5D6D7E]">{order.customer.email}</p>
                        <p className="text-sm text-[#5D6D7E] pt-2 border-t border-[#E9ECEF]">{order.shippingAddress}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-[#495057]">Payment Details</h3>
                        <div className="flex justify-between text-sm"><span className="text-[#5D6D7E]">Subtotal:</span><span className="text-[#495057]">${order.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-[#5D6D7E]">Shipping:</span><span className="text-[#495057]">${order.shipping.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-[#5D6D7E]">Tax:</span><span className="text-[#495057]">${order.tax.toFixed(2)}</span></div>
                        <div className="flex justify-between text-base pt-2 border-t border-[#E9ECEF]"><span className="font-bold text-[#495057]">Total:</span><span className="font-bold text-[#495057]">${order.total.toFixed(2)}</span></div>
                    </div>
                </div>
            </div>
            
            <OrderModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentStatus={order.status}
                onUpdate={handleStatusUpdate}
            />
        </div>
    )
}

export default OrderDetailPage