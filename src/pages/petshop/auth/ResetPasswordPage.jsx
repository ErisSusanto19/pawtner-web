import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { KeyRound, LockKeyhole } from 'lucide-react';

import RequestResetForm from './RequestResetForm';
import ResetPasswordForm from './ResetPasswordForm';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')
    console.log(token, 'cekk token reset password');
    

    const handleResetSuccess = () => {
        navigate('/signin')
    }

    const isResettingWithToken = !!token

    return (
        <div className="bg-[#BAC0CA] min-h-screen w-full flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg text-center space-y-6">
                
                {isResettingWithToken ? (
                    <LockKeyhole size={64} className="mx-auto text-indigo-500" />
                ) : (
                    <KeyRound size={64} className="mx-auto text-indigo-500" />
                )}

                <h1 className="text-2xl font-bold text-[#495057]">
                    {isResettingWithToken ? 'Set a New Password' : 'Forgot Your Password?'}
                </h1>

                <p className="text-gray-600">
                    {isResettingWithToken
                        ? 'Create a new, strong password for your account.'
                        : "No problem. Enter your email below and we'll send you a link to reset it."}
                </p>

                {isResettingWithToken ? (
                    <ResetPasswordForm token={token} onSuccess={handleResetSuccess} />
                ) : (
                    <RequestResetForm />
                )}
                
                <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">
                        Remember your password?{' '}
                        <Link to="/signin" className="font-medium text-[#545F71] hover:underline">
                            Back to Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage