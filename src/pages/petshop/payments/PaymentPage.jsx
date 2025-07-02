import React, { useEffect, useMemo, useState } from 'react';
import { Search, FileDown, ShoppingCart, Calendar as CalendarIcon, HandCoins, Wallet } from 'lucide-react';
import { formatCurrencyIDR, formatDate } from '../../../utils/formatter';
import { useNavigate } from 'react-router-dom';

const dummyPaymentsFromAPI = [
    {
        id: 1,
        order_id: 1, booking_id: null,
        payment_gateway_ref_id: 'd9b1c7e0-1234-5678-9abc-def012345678',
        amount: 59990.00,
        platform_fee: 2999.50,
        net_amount: 56990.50,
        payment_method: 'gopay',
        status: 'settlement',
        created_at: '2023-10-26T10:00:00Z',
    },
    {
        id: 2,
        order_id: null, booking_id: 1,
        payment_gateway_ref_id: 'a8c2d6f1-abcd-efgh-ijkl-mnopqrstuvwx',
        amount: 55000.00,
        platform_fee: 2750.00,
        net_amount: 52250.00,
        payment_method: 'credit_card',
        status: 'capture',
        created_at: '2023-10-26T11:30:00Z',
    },
    {
        id: 3,
        order_id: 2, booking_id: null,
        payment_gateway_ref_id: 'b7e3f5a2-wxyz-1234-5678-9abcdef01234',
        amount: 24500.00,
        platform_fee: 1225.00,
        net_amount: 23275.00,
        payment_method: 'bca_va',
        status: 'pending',
        created_at: '2023-10-25T15:45:00Z',
    },
    {
        id: 4,
        order_id: 3, booking_id: null,
        payment_gateway_ref_id: 'c6f4e4b3-5678-9abc-def0-123456789abc',
        amount: 12990.00,
        platform_fee: 650.00,
        net_amount: 12340.00,
        payment_method: 'ovo',
        status: 'failure',
        created_at: '2023-10-24T09:12:00Z',
    },
    {
        id: 5,
        order_id: null, booking_id: 2,
        payment_gateway_ref_id: 'e5d5d3c4-qrst-uvwx-yz12-3456789abcde',
        amount: 85000.00,
        platform_fee: 4250.00,
        net_amount: 80750.00,
        payment_method: 'credit_card',
        status: 'expire',
        created_at: '2023-10-23T18:20:00Z',
    },
]

const formatPaymentStatus = (status) => {
    switch (status) {
        case 'settlement':
        case 'capture':
            return { label: 'Success', badge: "bg-green-100 text-green-800" }
        case 'pending':
            return { label: 'Pending', badge: "bg-yellow-100 text-yellow-800" }
        case 'failure':
            return { label: 'Failed', badge: "bg-red-100 text-red-800" }
        case 'cancel':
            return { label: 'Canceled', badge: "bg-gray-200 text-gray-800" }
        case 'expire':
            return { label: 'Expired', badge: "bg-orange-100 text-orange-800" }
        default:
            return { label: status, badge: "bg-gray-100 text-gray-800" }
    }
}

const SummaryCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E9ECEF] flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-[#495057]">{title}</p>
            <p className="text-xl font-bold text-[#545F71]">{value}</p>
        </div>
    </div>
)

const PaymentPage = () => {
    const navigate = useNavigate()
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const processedData = dummyPaymentsFromAPI.map(p => ({
                ...p,
                displayStatus: formatPaymentStatus(p.status),
                type: p.order_id ? 'Product Order' : 'Service Booking',
                reference_id: p.order_id || p.booking_id,
                payment_method_label: p.payment_method.replace(/_/g, ' ').toUpperCase(),
            }));
            setPayments(processedData)
            setLoading(false)
        }, 1000)
    }, [])

    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            const matchesSearch = String(p.reference_id).includes(searchTerm) || p.payment_gateway_ref_id.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'All' || p.status === statusFilter
            return matchesSearch && matchesStatus
        });
    }, [payments, searchTerm, statusFilter])

    const summaryData = useMemo(() => {
        const successfulTxns = payments.filter(p => p.status === 'settlement' || p.status === 'capture')
        const totalRevenue = successfulTxns.reduce((acc, p) => acc + parseFloat(p.amount), 0)
        const pendingPayout = successfulTxns.reduce((acc, p) => acc + parseFloat(p.net_amount), 0)
        return { totalRevenue, pendingPayout }
    }, [payments])

    if (loading) return <div className="p-6 text-center">Loading payment history...</div>
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#495057]">Payment History</h1>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057] transition-colors">
                    <FileDown size={16} /> Export
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SummaryCard 
                    icon={<HandCoins size={24} className="text-green-600" />}
                    title="Gross Revenue (Settled)"
                    value={formatCurrencyIDR(summaryData.totalRevenue)}
                    color="bg-green-100"
                />
                <SummaryCard 
                    icon={<Wallet size={24} className="text-blue-600" />}
                    title="Net Payout (Estimated)"
                    value={formatCurrencyIDR(summaryData.pendingPayout)}
                    color="bg-blue-100"
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
                        <input 
                            type="text" 
                            placeholder="Search by Order/Booking ID, Gateway Ref..." 
                            className="w-full border border-[#E9ECEF] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <select 
                        className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="settlement">Success</option>
                        <option value="pending">Pending</option>
                        <option value="failure">Failed</option>
                        <option value="expire">Expired</option>
                        <option value="cancel">Canceled</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F8F9FA] text-left text-[#495057]">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Reference</th>
                                <th className="py-3 px-4 font-semibold">Date</th>
                                <th className="py-3 px-4 font-semibold text-right">Amount</th>
                                {/* <th className="py-3 px-4 font-semibold text-right">Net Received</th> */}
                                <th className="py-3 px-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((p) => (
                                <tr 
                                    key={p.id} 
                                    className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA] cursor-pointer"
                                    onClick={() => navigate(`/payments/${p.id}`)}
                                >
                                    <td className="py-3 px-4">
                                        <p className="font-medium text-[#545F71]">{p.type === 'Product Order' ? 'Order' : 'Booking'} #{p.reference_id}</p>
                                        <p className="text-xs text-[#ADB5BD]">Ref: {p.payment_gateway_ref_id}</p>
                                    </td>
                                    <td className="py-3 px-4 text-[#495057]">{formatDate(p.created_at)}</td>
                                    <td className="py-3 px-4 text-right">
                                        <p className="font-medium text-[#495057]">{formatCurrencyIDR(p.amount)}</p>
                                        <p className="text-xs text-[#ADB5BD]">{p.payment_method_label}</p>
                                    </td>
                                    {/* <td className="py-3 px-4 text-right">
                                        <p className="font-semibold text-green-700">{formatCurrencyIDR(p.net_amount)}</p>
                                        <p className="text-xs text-red-600">Fee: {formatCurrencyIDR(p.platform_fee)}</p>
                                    </td> */}
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${p.displayStatus.badge}`}>
                                            {p.displayStatus.label}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredPayments.length === 0 && (
                        <div className="text-center py-10 text-[#495057]">
                            <p>No payments found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PaymentPage