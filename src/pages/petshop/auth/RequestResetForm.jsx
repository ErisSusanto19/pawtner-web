import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { requestPasswordReset } from '../../../store/slices/authSlice';
import { toast } from 'react-toastify';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const RequestResetForm = () => {
    const dispatch = useDispatch()
    const { isLoading } = useSelector((state) => state.auth)
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        try {
            const successMessage = await dispatch(requestPasswordReset(data.email))
            toast.success(successMessage || 'Reset link sent! Please check your inbox.')
        } catch (e) {
            toast.error(e.message || 'Failed to send reset link.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                id="email"
                label="Email Address"
                type="email"
                register={register}
                rules={{ 
                    required: 'Email is required',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                    }
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
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </div>
        </form>
    )
}

export default RequestResetForm