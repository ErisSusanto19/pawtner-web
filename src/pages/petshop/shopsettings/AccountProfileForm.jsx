import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Save } from 'lucide-react';
import { toast } from 'react-toastify';

import Input from '../../../components/Input';
import Button from '../../../components/Button';
import FileUpload from '../../../components/FileUploadV2';
import TextArea from '../../../components/TextArea';

import { requestPasswordReset, updateUserProfile } from '../../../store/slices/authSlice';

const AccountProfileForm = ({ initialData }) => {
    const dispatch = useDispatch()
    const { isLoading: isAuthLoading } = useSelector((state) => state.auth)

    const { 
        register: registerUser, 
        handleSubmit: handleUserSubmit, 
        formState: { errors: userErrors, isSubmitting: isUserSubmitting }, 
        setValue, 
        watch 
    } = useForm({
        defaultValues: initialData || {}
    })
    
    const onUserSubmit = async (data) => {
        try {
            await dispatch(updateUserProfile(data))
            toast.success("Personal info saved successfully!")
        } catch (error) {
            toast.error(error.message || "Failed to save personal info.")
        }
    }

    const handleResetRequest = async () => {
        if (!initialData?.email) {
            toast.error("User email is not available.")
            return
        }

        if (window.confirm("Are you sure you want to send a password reset link to your email?")) {
            try {
                const message = await dispatch(requestPasswordReset(initialData.email))
                toast.success(message || "Password reset link sent!")
            } catch (error) {
                toast.error(error.message || "Failed to send reset link.")
            }
        }
    }

    if (!initialData) {
        return <div className="p-6 text-center">Loading account details...</div>
    }
    
    const isProcessing = isUserSubmitting || isAuthLoading

    return (
        <div className="space-y-6">
            <form onSubmit={handleUserSubmit(onUserSubmit)} className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <h3 className="text-lg font-semibold text-[#495057] mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="md:col-span-1">
                        <FileUpload
                            name="imageUrl"
                            label="Profile Picture"
                            accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                            register={registerUser}
                            setValue={setValue}
                            watch={watch}
                            errors={userErrors}
                            disabled={isProcessing}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <Input 
                            id="name" 
                            label="Full Name" 
                            type="text" 
                            register={registerUser} 
                            errors={userErrors}
                            rules={{ required: {value: true, message: "Name is required"} }}
                            disabled={isProcessing}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input 
                                id="email" 
                                label="Email" 
                                type="email" 
                                register={registerUser} 
                                errors={userErrors} 
                                disabled
                            />
                            <Input 
                                id="phone" 
                                label="Phone" 
                                type="tel" 
                                register={registerUser} 
                                errors={userErrors}
                                disabled={isProcessing}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                     <TextArea 
                        id="address" 
                        label="Address" 
                        rows={3} 
                        register={registerUser} 
                        errors={userErrors}
                        disabled={isProcessing}
                    />
                </div>
                
                <div className="flex justify-end pt-4 mt-4 border-t border-[#E9ECEF]">
                    <Button
                        buttonType="submit"
                        disabled={isProcessing}
                        isLoading={isProcessing}
                    >
                        <Save size={16} className={isProcessing ? "hidden" : "inline-block mr-2"} />
                        {isProcessing ? 'Saving...' : 'Save Personal Info'}
                    </Button>
                </div>
            </form>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <h3 className="text-lg font-semibold text-[#495057] mb-4">Password Security</h3>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        To change your password, we will send a secure reset link to your registered email address: <strong>{initialData.email}</strong>
                    </p>
                </div>
                <div className="flex justify-end pt-4 mt-4 border-t border-[#E9ECEF]">
                    <Button
                        onClick={handleResetRequest}
                        disabled={isAuthLoading}
                        isLoading={isAuthLoading}
                        danger
                    >
                        <Mail size={16} className={isAuthLoading ? "hidden" : "inline-block mr-2"} />
                        {isAuthLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AccountProfileForm