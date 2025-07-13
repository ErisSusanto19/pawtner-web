import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Save, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

import Input from '../../../components/Input';
import Button from '../../../components/Button';
import FileUpload from '../../../components/FileUploadV2';
import TextArea from '../../../components/TextArea';

import { requestPasswordReset, updateUserProfile, changeUserPassword } from '../../../store/slices/authSlice';
import MapPicker from '../../../components/MapPicker';
import { useState } from 'react';
import ConfirmationModal from '../../../components/ConfirmationModal';

const AccountProfileForm = ({ initialData }) => {
    const dispatch = useDispatch()
    const { isLoading: isAuthLoading, isProfileUpdating, isPasswordChanging } = useSelector((state) => state.auth)

    // const [isResetModalOpen, setResetModalOpen] = useState(false);

    const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
    const [passwordChangeData, setPasswordChangeData] = useState(null);

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
            const response = await dispatch(updateUserProfile(data))
            toast.success(response.message || "Personal info saved successfully!")
        } catch (error) {
            toast.error(error.message || "Failed to save personal info.")
        }
    }

    // const handleResetRequest = async () => {
    //     if (!initialData?.email) {
    //         toast.error("User email is not available.")
    //         return
    //     }

    //     setResetModalOpen(true);
    // }

    // const handleConfirmReset = async () => {
    //     try {
    //         await dispatch(requestPasswordReset(initialData.email));
    //         toast.success("Password reset link sent!");
    //     } catch (error) {
    //         toast.error(error.message || "Failed to send reset link.");
    //     } finally {
    //         setResetModalOpen(false);
    //     }
    // };

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
        watch: watchPassword,
        reset: resetPasswordForm
    } = useForm({
        mode: 'onChange'
    });

    const onPasswordSubmit = (data) => {
        setPasswordChangeData(data);
        setChangePasswordModalOpen(true);
    }

    const handleConfirmPasswordChange = async () => {
        if (!passwordChangeData) return;
        try {
            const payload = { 
                oldPassword: passwordChangeData.currentPassword, 
                newPassword: passwordChangeData.newPassword 
            };
            const response = await dispatch(changeUserPassword(payload));
            toast.success(response.message || "Password changed successfully!");
            resetPasswordForm();
        } catch (error) {
            if(error.message?.includes('Password lama yang Anda masukkan salah.')){
                toast.error("The current password you entered is incorrect.")
            } else{
                toast.error(error.message || "Failed to change password.")
            }
        } finally {
            setChangePasswordModalOpen(false);
            setPasswordChangeData(null);
        }
    };

    if (!initialData) {
        return <div className="p-6 text-center">Loading account details...</div>
    }
    
    const isProfileProcessing = isUserSubmitting || isProfileUpdating;
    const isPasswordProcessing = isPasswordSubmitting || isPasswordChanging;

    // const watchedLat = watch('latitude');
    // const watchedLng = watch('longitude');

    // const [isLocating, setIsLocating] = useState(false)
    // const [locationError, setLocationError] = useState('')

    // const handleLocationSelect = async (lat, lng) => {
    //     setIsLocating(true)
    //     setLocationError('')

    //     try {
    //         setValue('latitude', lat, { shouldValidate: true });
    //         setValue('longitude', lng, { shouldValidate: true });

    //         const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
    //         const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`;

    //         const response = await fetch(url);
    //         if (!response.ok) throw new Error('Failed to fetch address.')

    //         const data = await response.json()

    //         if (data && data.display_name) {
    //             setValue('address', data.display_name, { shouldValidate: true })
    //             toast.success('Address updated from map!')
    //         } else {
    //             setValue('address', 'Address not found for this location.', { shouldValidate: true })
    //         }
    //     } catch (error) {
    //         setLocationError(error.message)
    //         toast.error(error.message)
    //     } finally {
    //         setIsLocating(false)
    //     }
    // }

    const MAX_FILE_SIZE_MB = 2;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form onSubmit={handleUserSubmit(onUserSubmit)} className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                    <h3 className="text-lg font-semibold text-[#495057] mb-4">Personal Information</h3>
                    
                    <div className="space-y-6">
                        <div className="flex justify-center mb-2">
                            <FileUpload
                                name="imageUrl"
                                label="Profile Picture"
                                accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                                register={registerUser}
                                setValue={setValue}
                                watch={watch}
                                errors={userErrors}
                                disabled={isProfileProcessing}
                                circle={true}
                                rules={{
                                    validate: {
                                        fileSize: (value) => {
                                            if (!value || !(value instanceof File)) return true;
                                            return value.size <= MAX_FILE_SIZE_BYTES || `File size must be less than ${MAX_FILE_SIZE_MB}MB`;
                                        }
                                    }
                                }}
                            />
                        </div>

                        <Input 
                            id="name" 
                            label="Full Name" 
                            type="text" 
                            register={registerUser} 
                            errors={userErrors}
                            rules={{ required: {value: true, message: "Name is required"} }}
                            disabled={isProfileProcessing}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                disabled={isProfileProcessing}
                            />
                        </div>

                        <TextArea 
                            id="address" 
                            label="Address" 
                            rows={3} 
                            register={registerUser} 
                            errors={userErrors}
                            disabled={isProfileProcessing}
                        />
                    </div>
                    {/* <input type="hidden" {...registerUser('latitude')} />
                    <input type="hidden" {...registerUser('longitude')} /> */}

                    {/* <div className='mt-6 space-y-4'>
                        <p className="text-sm text-gray-600">Click on the map to select your precise location.</p>
                        {isLocating && <p className="text-sm text-blue-600">Updating address...</p>}
                        {locationError && <p className="mt-1 text-sm text-red-500">{locationError}</p>}

                        <MapPicker 
                            onLocationSelect={handleLocationSelect}
                            initialLat={watchedLat}
                            initialLng={watchedLng}
                        />
                    </div> */}

                    {/* <p className="text-xs text-gray-500 mt-3 mb-4 ml-1">
                        This address is automatically filled from the map. You can edit it for more detail (e.g., add floor number or block).
                    </p> */}
                    
                    <div className="flex justify-end pt-4 mt-4 border-t border-[#E9ECEF]">
                        <Button
                            buttonType="submit"
                            disabled={isProfileProcessing}
                            isLoading={isProfileProcessing}
                        >
                            <Save size={16} className={isProfileProcessing ? "hidden" : "inline-block mr-2"} />
                            {isProfileProcessing ? 'Saving...' : 'Save Personal Info'}
                        </Button>
                    </div>
                </form>

                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                    <h3 className="text-lg font-semibold text-[#495057] mb-4">Change Password</h3>
                    <div className="space-y-4">
                        <Input
                            id="currentPassword"
                            label="Current Password"
                            type="password"
                            register={registerPassword}
                            errors={passwordErrors}
                            rules={{ required: "Current password is required" }}
                            disabled={isPasswordProcessing}
                        />
                        <Input
                            id="newPassword"
                            label="New Password"
                            type="password"
                            register={registerPassword}
                            errors={passwordErrors}
                            rules={{ 
                                required: "New password is required",
                                minLength: { value: 6, message: "Password must be at least 8 characters long" }
                            }}
                            disabled={isPasswordProcessing}
                        />
                        <Input
                            id="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                            register={registerPassword}
                            errors={passwordErrors}
                            rules={{
                                required: "Please confirm your new password",
                                validate: (value) =>
                                    value === watchPassword('newPassword') || "Passwords do not match"
                            }}
                            disabled={isPasswordProcessing}
                        />
                    </div>
                    <div className="flex justify-end pt-4 mt-4 border-t border-[#E9ECEF]">
                        <Button
                            buttonType="submit"
                            disabled={isPasswordProcessing}
                            isLoading={isPasswordProcessing}
                        >
                            <Lock size={16} className={isPasswordProcessing ? "hidden" : "inline-block mr-2"} />
                            {isPasswordProcessing ? 'Changing...' : 'Change Password'}
                        </Button>
                    </div>
                </form>

                <ConfirmationModal
                    isOpen={isChangePasswordModalOpen}
                    onClose={() => setChangePasswordModalOpen(false)}
                    onConfirm={handleConfirmPasswordChange}
                    title="Confirm Password Change"
                    message="Are you sure you want to change your password? This is an important security action."
                    isLoading={isPasswordChanging}
                />

                {/* <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
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
                </div> */}

                {/* <ConfirmationModal
                    isOpen={isResetModalOpen}
                    onClose={() => setResetModalOpen(false)}
                    onConfirm={handleConfirmReset}
                    title="Confirm Password Reset"
                    message={`Are you sure you want to send a password reset link to ${initialData?.email}? This action cannot be undone.`}
                    isLoading={isAuthLoading}
                /> */}

            </div>
        </div>
    )
}

export default AccountProfileForm