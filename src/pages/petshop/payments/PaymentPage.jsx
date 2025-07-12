import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, FileDown, Wallet } from 'lucide-react';
import { fetchBusinessBookings } from '../../../store/slices/bookingSlice';
import { fetchBusinessOrders } from '../../../store/slices/orderSlice';
import { formatCurrencyIDR, formatDate } from '../../../utils/formatter';
import PageLoader from '../../../components/PageLoader';
import Pagination from '../../../components/Pagination';

const getStatusBadge = (status) => {
    switch (status) {
        case 'COMPLETED':
        case 'CONFIRMED':
            return "bg-green-100 text-green-800";
        case 'PENDING_APPROVAL':
        case 'AWAITING_PAYMENT':
            return "bg-yellow-100 text-yellow-800";
        case 'CANCELLED':
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

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
);

const PaymentPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { items: bookings, status: bookingStatus } = useSelector((state) => state.bookings);
    const { items: orders, status: orderStatus } = useSelector((state) => state.orders);

    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');

    const [currentPage, setCurrentPage] = useState(1)
    const TRANSACTIONS_PER_PAGE = 5

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            dispatch(fetchBusinessBookings({ page: 0, size: 100 })),
            dispatch(fetchBusinessOrders({ page: 0, size: 100 }))
        ]).catch(err => {
            console.error("Failed to fetch transactions:", err);
            setError("Could not load transaction data. Please try again.");
        }).finally(() => {
            setIsLoading(false);
        });
    }, [dispatch]);

    const allTransactions = useMemo(() => {
        if (bookingStatus !== 'succeeded' || orderStatus !== 'succeeded') {
            return [];
        }

        const normalizedBookings = bookings
            .filter(b => b.status === 'COMPLETED' /**|| b.status === 'CONFIRMED'*/)
            .map(b => ({
                id: b.id,
                type: 'Service Booking',
                code: 'booking',
                referenceNumber: b.bookingNumber,
                createdAt: b.createdAt,
                customerName: b.customer?.name || 'N/A',
                totalAmount: b.totalPrice,
                status: b.status,
            }));

        const normalizedOrders = orders
            .filter(o => o.status === 'COMPLETED')
            .map(o => ({
                id: o.id,
                type: 'Product Order',
                code: 'order',
                referenceNumber: o.orderNumber,
                createdAt: o.createdAt,
                customerName: o.customer?.name || 'N/A',
                totalAmount: o.totalAmount,
                status: o.status,
            }));

        return [...normalizedBookings, ...normalizedOrders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    }, [bookings, orders, bookingStatus, orderStatus]);

    const filteredTransactions = useMemo(() => {
        setCurrentPage(1)
        return allTransactions.filter(t => {
            const matchesSearch = t.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  t.customerName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'All' || t.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [allTransactions, searchTerm, typeFilter]);

    const totalPages = Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE)

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE
        const endIndex = startIndex + TRANSACTIONS_PER_PAGE
        return filteredTransactions.slice(startIndex, endIndex)
    }, [filteredTransactions, currentPage])

    const totalRevenue = useMemo(() => {
        return allTransactions.reduce((acc, t) => acc + t.totalAmount, 0);
    }, [allTransactions]);

    const handleRowClick = (transaction) => {
        navigate(`/payments/${transaction.code}/${transaction.id}`)
    };
    console.log(filteredTransactions, 'cek transction filterted')
    
    if (isLoading) return <PageLoader message="Loading payment history..."/>
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#495057]">Payment History</h1>
                {/* <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]">
                    <FileDown size={16} /> Export
                </button> */}
            </div>

            <div className="grid grid-cols-1">
                <SummaryCard 
                    icon={<Wallet size={24} className="text-green-600" />}
                    title="Total Gross Revenue (Completed)"
                    value={formatCurrencyIDR(totalRevenue)}
                    color="bg-green-100"
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]" />
                        <input 
                            type="text" 
                            placeholder="Search by Ref Number or Customer Name..." 
                            className="w-full border border-[#E9ECEF] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <select 
                        className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#545F71] bg-white"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Product Order">Product Orders</option>
                        <option value="Service Booking">Service Bookings</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F8F9FA] text-left text-[#495057]">
                            <tr>
                                <th className="py-3 px-4 font-semibold text-center">#</th>
                                <th className="py-3 px-4 font-semibold">Reference</th>
                                <th className="py-3 px-4 font-semibold">Date</th>
                                <th className="py-3 px-4 font-semibold text-right">Amount</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTransactions.map((t, index) => (
                                <tr 
                                    key={t.id} 
                                    className="border-b border-[#E9ECEF] hover:bg-[#F8F9FA] cursor-pointer"
                                    onClick={() => handleRowClick(t)}
                                >
                                    <td className="py-3 px-4 text-center text-[#495057]">
                                        {(currentPage - 1) * TRANSACTIONS_PER_PAGE + index + 1}
                                    </td>
                                    <td className="py-3 px-4">
                                        <p className="font-medium text-[#545F71]">{t.referenceNumber}</p>
                                        <p className="text-xs text-[#ADB5BD]">{t.type} by {t.customerName}</p>
                                    </td>
                                    <td className="py-3 px-4 text-[#495057]">{formatDate(t.createdAt)}</td>
                                    <td className="py-3 px-4 text-right font-medium text-[#495057]">{formatCurrencyIDR(t.totalAmount)}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(t.status)}`}>
                                            {t.status.replace('_', ' ').toLowerCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-10 text-[#495057]">
                            <p>No payments found matching your criteria.</p>
                        </div>
                    )}

                </div>
            </div>
            {filteredTransactions.length > 0 && (
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}
        </div>
    )
}

export default PaymentPage