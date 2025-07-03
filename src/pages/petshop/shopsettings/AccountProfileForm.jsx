import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Save, Lock } from 'lucide-react';
import Input from '../../../components/Input';
import { changeUserPassword, updateUserProfile } from '../../../store/slices/authSlice';

const AccountProfileForm = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const { isLoading: isAuthLoading, error: authError } = useSelector((state) => state.auth)

    const { register: registerUser, handleSubmit: handleUserSubmit, formState: { errors: userErrors, isSubmitting: isUserSubmitting } } = useForm({
        defaultValues: user || {}
    })

    const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting }, reset: resetPassword, watch: watchPassword } = useForm()
    
    const onUserSubmit = async (data) => {
        await dispatch(updateUserProfile(data))
    }

    const onPasswordChange = async (data) => {
        try {
            await dispatch(changeUserPassword(data))
            alert("Password changed successfully!")
            resetPassword()
        } catch (error) {
            alert(`Error: ${error.message || "Failed to change password."}`)
        }
    }

    return (
        <div className="space-y-6">
            {/* Personal Info Card */}
            <form onSubmit={handleUserSubmit(onUserSubmit)} className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <h3 className="text-lg font-semibold text-[#495057] mb-4">Personal Information</h3>
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input id="name" label="Full Name" register={registerUser} errors={userErrors} rules={{ required: "Full name is required" }} />
                        <Input id="phone_number" label="Phone Number" type="tel" register={registerUser} errors={userErrors} />
                    </div>
                    <Input id="email" label="Login Email" type="email" register={registerUser} errors={userErrors} disabled />
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

            {/* Change Password Card */}
            <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <h3 className="text-lg font-semibold text-[#495057] mb-4">Change Password</h3>
                <div className="space-y-4">
                    <Input id="currentPassword" label="Current Password" type="password" register={registerPassword} errors={passwordErrors} rules={{ required: "Current password is required" }} />
                    <Input id="newPassword" label="New Password" type="password" register={registerPassword} errors={passwordErrors} rules={{ required: "New password is required" }} />
                    <Input 
                        id="confirmPassword" 
                        label="Confirm New Password" 
                        type="password" 
                        register={registerPassword} 
                        errors={passwordErrors} 
                        rules={{ 
                            required: "Please confirm your new password",
                            validate: value => value === watchPassword('newPassword') || "Passwords do not match"
                        }} 
                    />
                </div>
                <div className="flex justify-end pt-4 mt-4 border-t border-[#E9ECEF]">
                    <button 
                        type="submit"
                        disabled={isPasswordSubmitting || isAuthLoading}
                        className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]">
                        <Lock size={16} /> 
                        {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AccountProfileForm