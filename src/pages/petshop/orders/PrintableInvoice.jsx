import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import InvoiceTemplate from './InvoiceTemplate';
import { Printer } from 'lucide-react';

const PrintableInvoice = ({ order, financials, disabled }) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Invoice-${order?.orderNumber || 'details'}`,
    });

    return (
        <div>
            <button
                onClick={handlePrint}
                disabled={disabled}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#495057] bg-white border border-[#E9ECEF] rounded-md hover:bg-[#F8F9FA] disabled:opacity-50"
            >
                <Printer size={16} /> Print Invoice
            </button>

            <div style={{ display: 'none' }}>
                <InvoiceTemplate ref={componentRef} order={order} financials={financials} />
            </div>
        </div>
    )
}

export default PrintableInvoice