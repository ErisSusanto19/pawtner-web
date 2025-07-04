import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Shield, FileText, Phone, Mail } from 'lucide-react';
import { mockBusinesses } from './BusinessManagementPage'

const BusinessDetailPage = () => {
    const { businessId } = useParams()
    const [business, setBusiness] = useState(null)

    useEffect(() => {
        const foundBusiness = mockBusinesses.find(b => b.id.toString() === businessId)
        setBusiness(foundBusiness)
    }, [businessId])

    const handleAdminAction = (action) => {
        if (window.confirm(`Are you sure you want to ${action.replace('_', ' ')} this business?`)) {
            console.log(`Performing action: ${action} on business ID: ${business.id}`)
            alert(`Action "${action}" simulated.`)
            if(action === 'verify') setBusiness(prev => ({...prev, is_verified: true}))
            if(action === 'unverify') setBusiness(prev => ({...prev, is_verified: false}))
        }
    }

    if (!business) {
        return <p>Loading business details...</p>
    }

    return (
        <div className="space-y-6">
            <div>
                <Link to="/admin/businesses" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft size={16} />
                    Back to Business List
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-gray-500">{business.address}</p>
                    </div>
                    <img src={business.business_image_url} alt={business.name} className="w-24 h-24 rounded-lg object-cover border" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Info Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold mb-4">Business Information</h3>
                        <p className="text-sm text-gray-600">{business.description}</p>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div><span className="font-semibold">Type:</span> {business.business_type.replace('_', ' ')}</div>
                            <div><span className="font-semibold">Emergency Services:</span> {business.has_emergency_services ? 'Yes' : 'No'}</div>
                            <div><span className="font-semibold">Status:</span> {business.is_verified ? 'Verified' : 'Pending Verification'}</div>
                            <div><span className="font-semibold">Realtime Status:</span> {business.status_realtime}</div>
                        </div>
                    </div>
                    {/* Contact & Location Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold mb-4">Contact & Location</h3>
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-2"><Mail size={14} /> {business.business_email}</p>
                            <p className="flex items-center gap-2"><Phone size={14} /> {business.business_phone}</p>
                            {business.emergency_phone && <p className="flex items-center gap-2 text-red-600"><Phone size={14} /> {business.emergency_phone} (Emergency)</p>}
                        </div>
                         {/* Placeholder for map */}
                        <div className="mt-4 h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                           Map View (lat: {business.latitude}, lon: {business.longitude})
                        </div>
                    </div>
                </div>

                {/* Admin Actions Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h3 className="text-lg font-bold mb-4">Admin Actions</h3>
                        <div className="space-y-4">
                            {/* Verification */}
                            <a href={business.certificate_image_url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-md hover:bg-blue-200">
                                <FileText size={16} /> View Certificate
                            </a>
                            {business.is_verified ? (
                                <button onClick={() => handleAdminAction('unverify')} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-md hover:bg-yellow-200">
                                    <XCircle size={16} /> Revoke Verification
                                </button>
                            ) : (
                                <button onClick={() => handleAdminAction('verify')} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-md hover:bg-green-200">
                                    <CheckCircle size={16} /> Verify Business
                                </button>
                            )}
                            {/* Suspend Action */}
                             <button onClick={() => handleAdminAction('suspend')} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-md hover:bg-red-200">
                                <Shield size={16} /> Suspend Business
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BusinessDetailPage