import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import defImg from '@/assets/undraw_images_of1m.svg'

const StatusBadge = ({ status }) => {
    let bgColor, textColor, Icon, text;

    switch (status) {
        case 'Approved':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            Icon = ShieldCheck;
            text = 'Approved';
            break;
        case 'Pending':
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            Icon = Clock;
            text = 'Pending';
            break;
        case 'Rejected':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            Icon = AlertCircle;
            text = 'Rejected';
            break;
        default:
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            Icon = Clock;
            text = 'Unknown';
    }

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5 ${bgColor} ${textColor}`}>
            <Icon size={14} />
            {text}
        </span>
    );
};

const TypeBadge = ({ type }) => {
    const formattedType = type ? type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown'
    return (
        <span className="text-sm text-gray-700">{formattedType}</span>
    );
};

const BusinessesTable = ({ businesses, pageStartIndex }) => {
    if (!businesses || businesses.length === 0) {
        return <p className="text-center text-gray-500 py-8">No businesses found.</p>;
    }

    // console.log(businesses, 'cek business from component table');
    

    return (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {businesses.map((biz, index) => (
                        <tr key={biz.businessId}>
                            <td className="pl-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                {pageStartIndex + index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img 
                                        className="h-10 w-10 rounded-md object-cover" 
                                        src={biz.businessImageUrl || defImg} 
                                        alt={biz.businessName}
                                        onError={(e) => {
                                            e.target.onerror = null,
                                            e.target.src = defImg
                                        }}
                                    />
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{biz.businessName}</div>
                                        <div className="text-sm text-gray-500">{biz.businessEmail}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {biz.ownerName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <TypeBadge type={biz.businessType} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={biz.statusApproved} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {/* Link ke halaman detail menggunakan businessId */}
                                <Link to={`/admin/businesses/${biz.businessId}`} className="text-indigo-600 hover:text-indigo-900">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BusinessesTable;