import React from 'react';
import { formatCurrencyIDR, formatDate } from '../../../utils/formatter';

const InvoiceTemplate = React.forwardRef(({ order, financials }, ref) => {
    if (!order) return null

    return (
        <div ref={ref} className="p-8 font-sans text-gray-800">
            <div className="flex justify-between items-start pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold">{order.businessName || 'Your Business Name'}</h1>
                    <p className="text-sm">Invoice</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold">Order #{order.orderNumber}</p>
                    <p className="text-sm">Date: {formatDate(order.createdAt)}</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold">Billed To:</h2>
                <p>{order.customerName}</p>
            </div>

            <div className="mt-8">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 font-semibold">Item</th>
                            <th className="p-2 font-semibold text-center">Qty</th>
                            <th className="p-2 font-semibold text-right">Price</th>
                            <th className="p-2 font-semibold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{item.productName}</td>
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 text-right">{formatCurrencyIDR(item.pricePerUnit)}</td>
                                <td className="p-2 text-right">{formatCurrencyIDR(item.pricePerUnit * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mt-8">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrencyIDR(financials.subtotal)}</span></div>
                    <div className="flex justify-between"><span>Shipping & Others</span><span>{formatCurrencyIDR(financials.otherCosts)}</span></div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t"><span>Total</span><span>{formatCurrencyIDR(financials.total)}</span></div>
                </div>
            </div>

            <div className="mt-16 text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
            </div>
        </div>
    )
})

InvoiceTemplate.displayName = 'InvoiceTemplate'

export default InvoiceTemplate