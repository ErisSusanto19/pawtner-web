import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, User, Building, Lock, Image as ImageIcon } from 'lucide-react';

const dummyUserData = {
    name: "John Doe",
    email: "john.doe.owner@example.com",
    phone_number: "+62 811 9876 5432",
};

const dummyBusinessData = {
    name: "Paws & Whiskers Pet Clinic",
    description: "Your one-stop shop for all pet needs. We provide top-quality products, professional grooming, and loving vet care for your furry friends.",
    business_type: 'VETERINARY_CLINIC',
    has_emergency_services: true,
    business_email: "contact@pawsandwhiskers.com",
    business_phone: "+62 21 1234 5678",
    emergency_phone: "+62 21 8765 4321",
    address: "Jl. Pecinta Hewan No. 42, Jakarta Selatan",
    operation_hours: [
        { day: 'Monday', open: '09:00', close: '20:00', isOpen: true },
        { day: 'Tuesday', open: '09:00', close: '20:00', isOpen: true },
        { day: 'Wednesday', open: '09:00', close: '20:00', isOpen: true },
        { day: 'Thursday', open: '09:00', close: '20:00', isOpen: true },
        { day: 'Friday', open: '09:00', close: '20:00', isOpen: true },
        { day: 'Saturday', open: '10:00', close: '18:00', isOpen: true },
        { day: 'Sunday', open: '00:00', close: '00:00', isOpen: false },
    ],
    business_image_url: 'https://via.placeholder.com/150',
    certificate_image_url: 'https://via.placeholder.com/200x100'
};


const SettingPage = () => {
    const [activeTab, setActiveTab] = useState('business')

    const { register: registerBusiness, handleSubmit: handleBusinessSubmit, watch } = useForm({ defaultValues: dummyBusinessData })
    const watchedHours = watch('operation_hours')

    const { register: registerUser, handleSubmit: handleUserSubmit } = useForm({ defaultValues: dummyUserData })
    const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm()
    
    const onBusinessSubmit = (data) => {
        console.log("Saving Business Profile:", data)
        alert("Business profile saved successfully!")
    };
    
    const onUserSubmit = (data) => {
        console.log("Saving User Account:", data);
        alert("Personal account saved successfully!")
    };
    
    const onPasswordChange = (data) => {
        console.log("Changing password:", data)
        alert("Password changed successfully!")
        resetPassword();
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full space-y-6">
            <h1 className="text-2xl font-bold text-[#495057]">Settings</h1>
            
            <div className="border-b border-[#E9ECEF]">
                <nav className="-mb-px flex space-x-6">
                    <button
                        onClick={() => setActiveTab('business')}
                        className={`py-3 px-1 inline-flex items-center gap-2 text-sm font-medium whitespace-nowrap ${
                            activeTab === 'business'
                                ? 'border-b-2 border-[#545F71] text-[#545F71]'
                                : 'border-b-2 border-transparent text-[#5D6D7E] hover:text-[#495057]'
                        }`}
                    >
                        <Building size={16} /> Business Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`py-3 px-1 inline-flex items-center gap-2 text-sm font-medium whitespace-nowrap ${
                            activeTab === 'account'
                                ? 'border-b-2 border-[#545F71] text-[#545F71]'
                                : 'border-b-2 border-transparent text-[#5D6D7E] hover:text-[#495057]'
                        }`}
                    >
                        <User size={16} /> My Account
                    </button>
                </nav>
            </div>

            <div>
                {activeTab === 'business' && (
                    <form onSubmit={handleBusinessSubmit(onBusinessSubmit)} className="space-y-6">
                        {/* Business General Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                            <h3 className="text-lg font-semibold text-[#495057] mb-4">General Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Business Name</label>
                                    <input {...registerBusiness('name')} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Description</label>
                                    <textarea {...registerBusiness('description')} rows="3" className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2"></textarea>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                     <div>
                                        <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Business Type</label>
                                        <select {...registerBusiness('business_type')} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 bg-white">
                                            <option value="VETERINARY_CLINIC">Veterinary Clinic</option>
                                            <option value="PET_SHOP">Pet Shop</option>
                                            <option value="GROOMING_SALON">Grooming Salon</option>
                                            <option value="BOARDING_DAYCARE">Boarding / Daycare</option>
                                            <option value="HYBRID">Hybrid (Multiple Services)</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id="has_emergency_services" {...registerBusiness('has_emergency_services')} className="h-4 w-4 rounded border-gray-300" />
                                            <label htmlFor="has_emergency_services" className="text-sm font-medium text-[#5D6D7E]">Offers Emergency Services</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                            <h3 className="text-lg font-semibold text-[#495057] mb-4">Contact & Location</h3>
                             <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Business Email</label>
                                        <input type="email" {...registerBusiness('business_email')} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2" />
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Business Phone</label>
                                        <input type="tel" {...registerBusiness('business_phone')} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Emergency Phone <span className="text-xs text-[#ADB5BD]">(if applicable)</span></label>
                                    <input type="tel" {...registerBusiness('emergency_phone')} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Full Address</label>
                                    <input {...registerBusiness('address')} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2" />
                                </div>
                             </div>
                        </div>
                        {/* ... Kartu Operating Hours & Branding bisa ditambahkan di sini dengan cara yang sama ... */}

                        <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                            <h3 className="text-lg font-semibold text-[#495057] mb-1">Operating Hours</h3>
                            <p className="text-sm text-[#5D6D7E] mb-6">Set your weekly business hours. Uncheck a day to mark it as closed.</p>
                            
                            <div className="space-y-4">
                                {dummyBusinessData.operation_hours.map((item, index) => (
                                    <div key={item.day} className="grid grid-cols-12 gap-x-4 gap-y-2 items-center pb-4 border-b border-[#F8F9FA] last:border-b-0">
                                        
                                        <div className="col-span-12 md:col-span-3">
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    id={`isOpen-${index}`} 
                                                    {...registerBusiness(`operation_hours.${index}.isOpen`)} 
                                                    className="h-4 w-4 rounded border-gray-300 text-[#545F71] focus:ring-[#545F71]" 
                                                />
                                                <label htmlFor={`isOpen-${index}`} className="text-sm font-medium text-[#495057]">{item.day}</label>
                                            </div>
                                        </div>

                                        <div className="col-span-12 md:col-span-9 flex items-center gap-3">
                                            {/* Gunakan nilai dari watch untuk men-disable input */}
                                            {watchedHours && watchedHours[index]?.isOpen ? (
                                                <>
                                                    <input 
                                                        type="time" 
                                                        {...registerBusiness(`operation_hours.${index}.open`)} 
                                                        className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#545F71]"
                                                    />
                                                    <span className="text-center text-[#ADB5BD]">-</span>
                                                    <input 
                                                        type="time" 
                                                        {...registerBusiness(`operation_hours.${index}.close`)} 
                                                        className="w-full border border-[#E9ECEF] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#545F71]"
                                                    />
                                                </>
                                            ) : (
                                                <div className="w-full text-center py-1.5 text-sm text-[#ADB5BD] bg-[#F8F9FA] rounded-lg">
                                                    Closed
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-[#E9ECEF]">
                            <button type="submit" className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]"><Save size={16} /> Save Business Info</button>
                        </div>
                    </form>
                )}

                {activeTab === 'account' && (
                    <div className="space-y-6">
                        {/* Personal Info */}
                        <form onSubmit={handleUserSubmit(onUserSubmit)} className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                             <h3 className="text-lg font-semibold text-[#495057] mb-4">Personal Information</h3>
                             <div className="space-y-4">
                                 <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Full Name</label>
                                        <input {...registerUser('name')} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Phone Number</label>
                                        <input type="tel" {...registerUser('phone_number')} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2" />
                                    </div>
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Login Email <span className="text-xs text-[#ADB5BD]">(cannot be changed)</span></label>
                                    <input type="email" {...registerUser('email')} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2 bg-gray-100" disabled />
                                 </div>
                             </div>
                             <div className="flex justify-end pt-4 mt-4 border-t border-[#E9ECEF]">
                                <button type="submit" className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]"><Save size={16} /> Save Personal Info</button>
                            </div>
                        </form>
                        {/* Security */}
                        <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                            <h3 className="text-lg font-semibold text-[#495057] mb-4">Change Password</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Current Password</label>
                                    <input type="password" {...registerPassword('currentPassword', { required: true })} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5D6D7E] mb-1">New Password</label>
                                    <input type="password" {...registerPassword('newPassword', { required: true })} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5D6D7E] mb-1">Confirm New Password</label>
                                    <input type="password" {...registerPassword('confirmPassword', { required: true })} className="w-full border border-[#E9ECEF] rounded-lg px-3 py-2" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 mt-4 border-t border-[#E9ECEF]">
                                <button type="submit" className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]"><Lock size={16} /> Update Password</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SettingPage