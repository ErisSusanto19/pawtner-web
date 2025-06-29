import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, MoreVertical } from 'lucide-react';

const dummyOrders = [
    { id: 'order_1024', customer: { name: 'Budi Hartono', email: 'budi.h@example.com' }, date: '2023-10-26', total: 75.50, status: 'Delivered', items: 3 },
    { id: 'order_1023', customer: { name: 'Citra Lestari', email: 'citra.l@example.com' }, date: '2023-10-25', total: 49.99, status: 'Shipped', items: 1 },
    { id: 'order_1022', customer: { name: 'Ahmad Dahlan', email: 'ahmad.d@example.com' }, date: '2023-10-25', total: 124.00, status: 'Processing', items: 5 },
    { id: 'order_1021', customer: { name: 'Dewi Sartika', email: 'dewi.s@example.com' }, date: '2023-10-24', total: 24.50, status: 'Pending', items: 2 },
    { id: 'order_1020', customer: { name: 'Eka Kurniawan', email: 'eka.k@example.com' }, date: '2023-10-22', total: 88.75, status: 'Cancelled', items: 4 },
    { id: 'order_1019', customer: { name: 'Fajar Nugraha', email: 'fajar.n@example.com' }, date: '2023-10-21', total: 15.99, status: 'Delivered', items: 1 },
];

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

const OrderPage = () => {
    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('All')

    const filteredOrders = useMemo(() => {
        return dummyOrders.filter(order => {
            const matchesSearch = 
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, selectedStatus]);
    
    const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">

            <div className="flex justify-between items-center">
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
                                    <td className="py-3 px-4 font-medium text-[#545F71]">#{order.id.split('_')[1]}</td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="font-medium text-[#5D6D7E]">{order.customer.name}</p>
                                            <p className="text-xs text-[#ADB5BD]">{order.customer.email}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-[#495057]">{order.date}</td>
                                    <td className="py-3 px-4 text-[#495057]">${order.total.toFixed(2)}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center items-center gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}
                                                className="p-1 text-[#545F71] hover:text-blue-600"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {/* Anda bisa menambahkan tombol lain di sini, misal dropdown untuk "Update Status" */}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); alert(`More actions for #${order.id}`); }}
                                                className="p-1 text-[#545F71] hover:text-gray-800"
                                                title="More Actions"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
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
        </div>
    )
}

export default OrderPage