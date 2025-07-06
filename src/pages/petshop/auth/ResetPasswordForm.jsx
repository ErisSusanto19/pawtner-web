import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../../store/slices/authSlice';
import { toast } from 'react-toastify';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const ResetPasswordForm = ({ token, onSuccess }) => {
    const dispatch = useDispatch()
    const { isLoading } = useSelector((state) => state.auth)
    const { register, handleSubmit, formState: { errors }, watch } = useForm()

    const onSubmit = async (data) => {
        try {
            const resetData = { token, newPassword: data.newPassword }
            const successMessage = await dispatch(resetPassword(resetData))
            toast.success(successMessage || 'Password has been reset successfully!')
            if (onSuccess) onSuccess();
        } catch (e) {
            toast.error(e.message || 'Failed to reset password. The token may be invalid or expired.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                id="newPassword"
                label="New Password"
                type="password"
                register={register}
                rules={{ 
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                }}
                errors={errors}
                disabled={isLoading}
            />
            <Input
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                register={register}
                rules={{
                    required: 'Please confirm your password',
                    validate: (value) =>
                        value === watch('newPassword') || 'The passwords do not match'
                }}
                errors={errors}
                disabled={isLoading}
            />
            <div>
                <Button
                    buttonType="submit"
                    disabled={isLoading}
                    isLoading={isLoading}
                    fullWidth
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
            </div>
        </form>
    )
}

export default ResetPasswordForm