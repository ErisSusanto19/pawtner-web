import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Building } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import NoBusinessProfile from './NoBusinessProfile';
import AccountProfileForm from './AccountProfileForm';
import BusinessProfileForm from './BusinessProfileForm';
import { fetchBusinessDetails } from '../../../store/slices/businessSlice'

const SettingPage = () => {
    const user = useSelector((state) => state.auth.user)
    const { details: business, status } = useSelector((state) => state.business)
    const dispatch = useDispatch()
    const hasBusiness = user?.hasBusiness || false

    const [activeTab, setActiveTab] = useState(hasBusiness ? 'business' : 'account')

    useEffect(() => {
        if (hasBusiness && !business && status !== 'loading') {
            dispatch(fetchBusinessDetails())
        }
    }, [hasBusiness, business, status, dispatch])
    
    if (hasBusiness && status === 'loading') {
        return <div className="p-6 text-center">Loading Business Profile...</div>
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <h1 className="text-2xl font-bold text-[#495057]">Settings</h1>
            
            <div className="border-b border-[#E9ECEF]">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('account')} className={`py-3 px-1 inline-flex items-center gap-2 text-sm font-medium ${activeTab === 'account' ? 'border-b-2 border-[#545F71] text-[#545F71]' : 'border-transparent text-[#5D6D7E]'}`}>
                        <User size={16} /> My Account
                    </button>
                    <button onClick={() => setActiveTab('business')} className={`py-3 px-1 inline-flex items-center gap-2 text-sm font-medium ${activeTab === 'business' ? 'border-b-2 border-[#545F71] text-[#545F71]' : 'border-transparent text-[#5D6D7E]'}`}>
                        <Building size={16} /> Business Profile
                    </button>
                </nav>
            </div>

            <div>
                {activeTab === 'account' && <AccountProfileForm />}

                {activeTab === 'business' && (
                    hasBusiness && business ? (
                        <BusinessProfileForm initialData={business}/>
                    ) : (
                        <NoBusinessProfile />
                    )
                )}
            </div>
        </div>
    )
}

export default SettingPage