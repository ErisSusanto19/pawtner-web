import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Hash, CreditCard, Clock, User, ShoppingBag, Briefcase, DollarSign, Percent, Pocket, HandCoins } from 'lucide-react';
import { formatCurrencyIDR, formatDate } from '../../../utils/formatter';

const dummyTransactionDetail = {
    payment: {
        id: 1,
        order_id: 1, booking_id: null,
        payment_gateway_ref_id: 'd9b1c7e0-1234-5678-9abc-def012345678',
        amount: 59990.00,
        platform_fee: 2999.50,
        net_amount: 56990.50,
        payment_method: 'gopay',
        status: 'settlement',
        created_at: '2023-10-26T10:00:00Z',
        updated_at: '2023-10-26T10:01:15Z'
    },
    related_item: {
        type: 'Product Order',
        items: [
            { id: 'prod_001', name: 'Royal Canin Maxi Adult', quantity: 1, price: 59990.00 },
        ]
    },
    // related_item: {
    //     type: 'Service Booking',
    //     items: [
    //         { id: 'svc_01', name: 'Premium Full Grooming', date: '2023-10-28', price: 55000.00 },
    //     ]
    // },
    customer: {
        name: 'Budi Santoso',
        email: 'budi.s@example.com'
    }
}

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

const DetailRow = ({ icon, label, value, valueClass = 'text-[#495057]' }) => (
    <div className="flex justify-between items-center py-3 border-b border-[#E9ECEF] last:border-b-0">
        <div className="flex items-center text-sm text-[#495057]">
            {icon}
            <span className="ml-2">{label}</span>
        </div>
        <span className={`text-sm font-medium ${valueClass}`}>{value}</span>
    </div>
)


const PaymentDetailPage = () => {
    const { paymentId } = useParams();
    const [transaction, setTransaction] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setTransaction(dummyTransactionDetail)
            setLoading(false)
        }, 500);
    }, [paymentId])

    if (loading) return <div className="p-6 text-center">Loading transaction details...</div>
    if (!transaction) return <div className="p-6 text-center text-red-600">Transaction not found.</div>
    
    const { payment, related_item, customer } = transaction
    const displayStatus = formatPaymentStatus(payment.status)
    const referenceId = payment.order_id || payment.booking_id
    const referenceType = payment.order_id ? 'Order' : 'Booking'
    const referenceLink = payment.order_id ? `/orders/${referenceId}` : `/petshop/bookings/${referenceId}`

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            
            <div>
                <Link to="/payments" className="flex items-center gap-2 text-sm text-[#545F71] hover:text-[#495057] mb-4">
                    <ArrowLeft size={16} /> Back to Payments
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-[#495057]">
                            Payment for {referenceType} #{referenceId}
                        </h1>
                        <p className="text-sm text-[#ADB5BD]">Gateway Ref: {payment.payment_gateway_ref_id}</p>
                    </div>
                    <span className={`px-4 py-2 text-sm font-semibold rounded-full ${displayStatus.badge}`}>
                        {displayStatus.label}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                        <h2 className="text-lg font-semibold text-[#495057] mb-4 flex items-center">
                            {related_item.type === 'Product Order' 
                                ? <ShoppingBag size={20} className="mr-2" /> 
                                : <Briefcase size={20} className="mr-2" />}
                            {related_item.type} Details
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-[#ADB5BD]">
                                    <tr>
                                        <th className="py-2 font-normal">Item</th>
                                        <th className="py-2 font-normal text-center">Quantity</th>
                                        <th className="py-2 font-normal text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {related_item.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-2 font-medium text-[#545F71]">{item.name}</td>
                                            <td className="py-2 text-center text-[#495057]">{item.quantity || 1}</td>
                                            <td className="py-2 text-right font-medium text-[#495057]">{formatCurrencyIDR(item.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                        <h2 className="text-lg font-semibold text-[#495057] mb-4 flex items-center">
                            <User size={20} className="mr-2" /> Customer Information
                        </h2>
                        <DetailRow icon={<></>} label="Name" value={customer.name} />
                        <DetailRow icon={<></>} label="Email" value={customer.email} />
                    </div>
                </div>

                <div className="space-y-6">

                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                        <h2 className="text-lg font-semibold text-[#495057] mb-4">Financial Summary</h2>
                        <DetailRow icon={<HandCoins size={16} />} label="Gross Amount" value={formatCurrencyIDR(payment.amount)} />
                        {/* <DetailRow icon={<Percent size={16} />} label="Platform Fee" value={`- ${formatCurrencyIDR(payment.platform_fee)}`} valueClass="text-red-600" />
                        <DetailRow icon={<Pocket size={16} />} label="Net Received" value={formatCurrencyIDR(payment.net_amount)} valueClass="text-green-700 font-bold" /> */}
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                        <h2 className="text-lg font-semibold text-[#495057] mb-4">Payment Info</h2>
                        <DetailRow icon={<Hash size={16} />} label="Payment ID" value={payment.id} />
                        <DetailRow icon={<CreditCard size={16} />} label="Payment Method" value={payment.payment_method.replace('_', ' ').toUpperCase()} />
                        <DetailRow icon={<Clock size={16} />} label="Created At" value={formatDate(payment.created_at)} />
                        <DetailRow icon={<Clock size={16} />} label="Last Updated" value={formatDate(payment.updated_at)} />
                        <div className="mt-4">
                            <Link to={referenceLink} className="w-full text-center block px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057] transition-colors">
                                View Full {referenceType}
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PaymentDetailPage