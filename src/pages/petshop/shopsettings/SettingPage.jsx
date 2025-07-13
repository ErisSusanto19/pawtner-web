import React, { useState } from 'react';
import { User, Building } from 'lucide-react';
import AccountProfileTabContent from './AccountProfileTabContent';
import BusinessProfileTabContent from './BusinessProfileTabContent';

const SettingPage = () => {
    const [activeTab, setActiveTab] = useState('account')

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <h1 className="text-2xl font-bold text-[#495057]">Settings</h1>
            
            <div className="border-b border-[#E9ECEF]">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('account')} className={`py-3 px-1 inline-flex items-center gap-2 text-sm font-medium ${activeTab === 'account' ? 'border-b-2 border-[#545F71] text-[#545F71]' : 'border-transparent text-[#5D6D7E]'}`}>
                        <User size={16} /> My Account
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('business')} 
                        className={`py-3 px-1 inline-flex items-center gap-2 text-sm font-medium ${
                            activeTab === 'business' 
                                ? 'border-b-2 border-[#545F71] text-[#545F71]' 
                                : 'border-transparent text-[#5D6D7E]'
                        }`}
                    >
                        <Building size={16} /> Business Profile
                    </button>
                </nav>
            </div>

            <div>
                {activeTab === 'account' && <AccountProfileTabContent />}

                {activeTab === 'business' && <BusinessProfileTabContent />}
            </div>
        </div>
    )
}

export default SettingPage