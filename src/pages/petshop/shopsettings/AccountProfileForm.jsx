import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Save, Mail, Lock } from 'lucide-react';
import Input from '../../../components/Input';
import { requestPasswordReset, updateUserProfile } from '../../../store/slices/authSlice';
import { toast } from 'react-toastify';
import FileUpload from '../../../components/FileUploadV2';
import TextArea from '../../../components/TextArea'

const AccountProfileForm = ({ initialData }) => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const { isLoading: isAuthLoading, error: authError } = useSelector((state) => state.auth)

    const { register: registerUser, handleSubmit: handleUserSubmit, formState: { errors: userErrors, isSubmitting: isUserSubmitting }, setValue, watch } = useForm({
        defaultValues: user || {}
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
            return;
        }

        if (window.confirm("Are you sure you want to send a password reset link to your email?")) {
            try {
                const message = await dispatch(requestPasswordReset(initialData.email))
                toast.success(message || "Password reset link sent!");
            } catch (error) {
                toast.error(error.message || "Failed to send reset link.")
            }
        }
    }

    if (!initialData) {
        return <div className="p-6 text-center">Loading account details...</div>
    }

    return (
        <div className="space-y-6">
            {/* Personal Info Card */}
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
                            // rules={{ required: 'Profile picture is required.' }}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <Input 
                            id="name" 
                            label="Full Name" 
                            type="text" 
                            register={registerUser} 
                            errors={userErrors}
                            rules={{
                                required: {value: true, message: "Name is required"}, 
                            }}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input 
                                id="email" 
                                label="Email" type="email" 
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
                            />
                        </div>
                    </div>

                    {/* <TextArea 
                        id="address" 
                        label="Address" 
                        rows={3} 
                        register={registerUser} 
                        errors={userErrors}
                    /> */}
                </div>
                

                <div className="flex justify-end pt-4 mt-4 border-t border-[#E9ECEF]">
                    <button 
                        type="submit"
                        disabled={isUserSubmitting || isAuthLoading}
                        className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]"
                    >
                        <Save size={16} /> 
                        {isUserSubmitting ? 'Saving...' : 'Save Personal Info'}
                    </button>
                </div>
            </form>

            {/* Reset Password Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <h3 className="text-lg font-semibold text-[#495057] mb-4">Password Security</h3>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        To change your password, we will send a secure reset link to your registered email address: <strong>{initialData.email}</strong>
                    </p>
                </div>
                <div className="flex justify-end pt-4 mt-4 border-t border-[#E9ECEF]">
                    <button 
                        type="button" // Penting: type="button" agar tidak men-submit form lain
                        onClick={handleResetRequest}
                        disabled={isAuthLoading}
                        className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400"
                    >
                        <Mail size={16} /> 
                        {isAuthLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AccountProfileForm