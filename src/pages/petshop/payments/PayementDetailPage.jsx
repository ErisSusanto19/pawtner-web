import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';

// Impor thunk slices Anda
import { fetchOrderById } from '../../../store/slices/orderSlice'
import { fetchBookingById } from '../../../store/slices/bookingSlice';

import PageLoader from '../../../components/PageLoader';
import { formatCurrencyIDR, formatDate } from '../../../utils/formatter';

// Komponen Card untuk membungkus setiap seksi detail
const DetailCard = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
        <h3 className="text-lg font-semibold text-[#495057] border-b border-[#E9ECEF] pb-3 mb-4">{title}</h3>
        {children}
    </div>
);

// Komponen untuk baris detail agar rapi
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-2">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-medium text-[#495057] text-right">{value}</span>
    </div>
);


const PaymentDetailPage = () => {
    const { type, id } = useParams();
    console.log(type, '<< cek type')
    console.log(id, '<< cek id')
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Ambil data dari kedua slice. Hanya satu yang akan relevan pada satu waktu.
    const { currentOrder: orderData, status: orderStatus, error: orderError } = useSelector(state => state.orders);
    const { currentBooking: bookingData, status: bookingStatus, error: bookingError } = useSelector(state => state.bookings);

    useEffect(() => {
        if (type == 'order') {
            dispatch(fetchOrderById(id));
        } else if (type == 'booking') {
            dispatch(fetchBookingById(id));
        }
    }, [dispatch, type, id]);

    // useMemo untuk menyatukan data dari order atau booking menjadi satu struktur
    const transactionDetails = useMemo(() => {
        
        if (type == 'order' && orderData?.id == id) {
            return {
                type: 'Product Order',
                referenceId: orderData.id,
                date: orderData.completedAt || orderData.createdAt,
                customer: {
                    name: orderData.customer?.name || 'N/A',
                    email: orderData.customer?.email || 'N/A',
                },
                items: orderData.items?.map(item => ({
                    name: item.productName || 'Product Not Found',
                    quantity: item.quantity,
                    price: item.pricePerUnit,
                    total: item.quantity * item.pricePerUnit
                })) || [],
                totalAmount: orderData.totalAmount,
                // paymentMethod: orderData.paymentMethod || 'Not specified',
                status: orderData.status,
            };
        }
        
        if (type == 'booking' && bookingData?.id == id) {
            return {
                type: 'Service Booking',
                referenceId: bookingData.id,
                date: bookingData.createdAt,
                customer: {
                    name: bookingData.customer?.name || 'N/A',
                    email: bookingData.customer?.email || 'N/A',
                },
                items: [{
                    name: `Booking for ${bookingData.service?.name || 'Service Not Found'}`,
                    quantity: 1,
                    price: bookingData.totalCost,
                    total: bookingData.totalCost
                }],
                totalAmount: bookingData.totalPrice,
                paymentMethod: bookingData.paymentDetails?.method || 'Not specified',
                status: bookingData.status,
            };
        }

        return null;
    }, [type, id, orderData, bookingData]);

    const status = type === 'order' ? orderStatus : bookingStatus;
    const error = type === 'order' ? orderError : bookingError;

    if (status === 'loading') return <PageLoader message={`Loading ${type} details...`} />;
    if (status === 'failed') return <div className="p-6 text-center text-red-600">{error}</div>;
    if (!transactionDetails) return <div className="p-6 text-center text-gray-500">Payment data not found.</div>;

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-[#495057]" />
                    </button>
                    <h1 className="text-2xl font-bold text-[#495057]">
                        Payment Details
                    </h1>
                </div>

                <div className="space-y-6">
                    <DetailCard title="Payment Summary">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <DetailRow label="Reference ID" value={transactionDetails.referenceId} />
                            <DetailRow label="Payment Type" value={transactionDetails.type} />
                            <DetailRow label="Payment Date" value={formatDate(transactionDetails.date)} />
                            <DetailRow label="Payment Status" value={
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                    {transactionDetails.status}
                                </span>
                            }/>
                            {/* <DetailRow label="Payment Method" value={transactionDetails.paymentMethod} /> */}
                            {transactionDetails.type == 'Service Booking' && (
                                <DetailRow label="Total Cost" value={formatCurrencyIDR(transactionDetails.totalAmount)} />
                            )}
                        </div>
                    </DetailCard>

                    <DetailCard title="Customer Information">
                         <DetailRow label="Customer Name" value={transactionDetails.customer.name} />
                         <DetailRow label="Email Address" value={transactionDetails.customer.email} />
                    </DetailCard>

                    {transactionDetails.type === 'Product Order' && (
                        <DetailCard title="Item Details">
                            <table className="w-full text-sm">
                                <thead className="text-left text-[#495057]">
                                    <tr className="border-b">
                                        <th className="py-2 px-3 font-semibold">Item/Service</th>
                                        <th className="py-2 px-3 font-semibold text-center">Quantity</th>
                                        <th className="py-2 px-3 font-semibold text-right">Unit Price</th>
                                        <th className="py-2 px-3 font-semibold text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactionDetails.items.map((item, index) => (
                                        <tr key={index} className="border-b last:border-none">
                                            <td className="py-3 px-3">{item.name}</td>
                                            <td className="py-3 px-3 text-center">{item.quantity}</td>
                                            <td className="py-3 px-3 text-right">{formatCurrencyIDR(item.price)}</td>
                                            <td className="py-3 px-3 text-right">{formatCurrencyIDR(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-bold">
                                        <td colSpan="3" className="py-3 px-3 text-right text-[#495057]">Grand Total</td>
                                        <td className="py-3 px-3 text-right text-lg text-[#495057]">{formatCurrencyIDR(transactionDetails.totalAmount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </DetailCard>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailPage