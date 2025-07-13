// src/pages/Auth/VerifyEmailPage.jsx

import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { MailCheck, LoaderCircle } from 'lucide-react';

import { verifyUserEmail, resendVerificationLink } from '../../../store/slices/authSlice';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { toast } from 'react-toastify';

const VerifyEmailPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { isLoading, error, message, status } = useSelector((state) => state.auth)

    const [resendTimer, setResendTimer] = useState(0)
    const [isRedirecting, setIsRedirecting] = useState(false)

    const email = location.state?.email || 'your email address'

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            verificationCode: ''
        }
    })

    const onSubmit = async (formData) => {        
        if (!email || email === 'your email address') {
            toast.error('Email address not found. Please go back to sign up.')
            return
        }
        const verificationData = {
            email: email,
            verificationCode: formData.verificationCode
        }

        try {
            await dispatch(verifyUserEmail(verificationData))
            
            toast.success('Verification successful!')
            setIsRedirecting(true)
            
            setTimeout(() => {
                navigate('/signin')
            }, 1500)

        } catch (err) {
            toast.error(err.message || "Verification failed. Please check the code.")
        }
    }

    const handleResend = async () => {
        if (!email || email === 'your email address') {
            toast.error('Email address not found. Please try registering again.')
            return
        }

        try {
            await dispatch(resendVerificationLink(email))
            
            toast.success("A new verification link has been sent.")
            setResendTimer(10)

        } catch (err) {
            toast.error(err.message || "Failed to resend the link.")
        }
    }

    // useEffect(() => {
    //     if (status === 'verified') {
    //         toast.success(message || 'Verification successful! You can now sign in.');

    //         setIsRedirecting(true)

    //         const timeout = setTimeout(() => {
    //             navigate('/signin')
    //         }, 2000)

    //         return () => clearTimeout(timeout)
    //     }
    // }, [status, navigate, message])

    useEffect(() => {
        if (resendTimer === 0) return;

        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [resendTimer])

    if (isRedirecting) {
        return (
            <div className="bg-[#BAC0CA] min-h-screen w-full flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <LoaderCircle className="animate-spin text-[#495057] mx-auto" size={40} />
                    <p className="text-[#495057] text-lg font-medium">Redirecting to sign in...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#BAC0CA] min-h-screen w-full flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg text-center space-y-6">
                <MailCheck size={64} className="mx-auto text-green-500" />
                
                <h1 className="text-2xl font-bold text-[#495057]">Please Verify Your Email</h1>
                
                <p className="text-gray-600">
                    We've sent a verification code to:
                </p>
                
                <p className="font-semibold text-[#545F71] break-words">{email}</p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Input
                            id="verificationCode"
                            label="Verification Code"
                            type="text"
                            register={register}
                            errors={errors}
                            rules={{
                                required: 'Verification code is required.',
                                minLength: {
                                    value: 6,
                                    message: 'Code must be at least 6 characters'
                                }
                            }}
                            placeholder="Enter code from your email"
                        />
                    </div>

                    {/* {error && status !== 'verified' && <p className="text-red-500 text-sm text-center">{error}</p>} */}
                    
                    {/* {message && status === 'registered' && <p className="text-green-600 text-sm text-center">{message}</p>} */}

                    <Button buttonType="submit" fullWidth disabled={!isValid || isLoading}>
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <LoaderCircle className="animate-spin mr-2" size={20} />
                                Verifying...
                            </span>
                        ) : (
                            'Verify Account'
                        )}
                    </Button>
                </form>

                <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">
                        Didn't receive the email?{' '}
                        <button 
                            onClick={handleResend} 
                            disabled={isLoading || resendTimer > 0}
                            className="font-medium text-[#545F71] hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend verification link'}
                        </button>
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        <Link to="/signin" className="font-medium text-[#545F71] hover:underline">
                            Back to Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmailPage