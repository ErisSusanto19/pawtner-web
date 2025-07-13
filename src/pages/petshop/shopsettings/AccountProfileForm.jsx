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

    const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
    const [passwordChangeData, setPasswordChangeData] = useState(null);

    const { 
        register: registerUser, 
        handleSubmit: handleUserSubmit, 
        formState: { errors: userErrors, isSubmitting: isUserSubmitting, isValid: isUserValid, isDirty: isUserDirty }, 
        setValue, 
        watch 
    } = useForm({
        mode: 'onChange',
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

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting, isValid: isPasswordValid, isDirty: isPasswordDirty },
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
    }

    if (!initialData) {
        return <div className="p-6 text-center">Loading account details...</div>
    }
    
    const isProfileProcessing = isUserSubmitting || isProfileUpdating;
    const isPasswordProcessing = isPasswordSubmitting || isPasswordChanging;

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
                                rules={{
                                    pattern: {value: /^((\+62|62|0)(8[1-9][0-9]{6,13}|2[1-9][0-9]{6,10}))$/, message: "Please use a valid phone number"}
                                }}
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
                    
                    <div className="flex justify-end pt-4 mt-4 border-t border-[#E9ECEF]">
                        <Button
                            buttonType="submit"
                            disabled={!isUserDirty || !isUserValid || isProfileProcessing}
                            isLoading={isProfileProcessing}
                        >
                            <Save size={16} className={isProfileProcessing ? "hidden" : "inline-block mr-2"} />
                            {/* {isProfileProcessing ? 'Saving...' : 'Save Personal Info'} */}
                            Save Personal Info
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
                            disabled={ !isPasswordDirty || !isPasswordValid || isPasswordProcessing }
                            isLoading={isPasswordProcessing}
                        >
                            <Lock size={16} className={isPasswordProcessing ? "hidden" : "inline-block mr-2"} />
                            {/* {isPasswordProcessing ? 'Changing...' : 'Change Password'} */}
                            Change Password
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

            </div>
        </div>
    )
}

export default AccountProfileForm