import { useLocation, Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react'

const VerifyEmailPage = () => {
    const location = useLocation();
    const email = location.state?.email || 'your email address'

    const handleResend = () => {
        alert('Verification email has been resent!');
    };

    return (
        <div className="bg-[#BAC0CA] min-h-screen w-full flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg text-center space-y-6">
                <MailCheck size={64} className="mx-auto text-green-500" />
                
                <h1 className="text-2xl font-bold text-[#495057]">Please Verify Your Email</h1>
                
                <p className="text-gray-600">
                    Thank you for signing up! We've sent a verification link to:
                </p>
                
                <p className="font-semibold text-[#545F71] break-words">{email}</p>
                
                <p className="text-gray-600 text-sm">
                    Please check your inbox (and spam folder) to activate your account.
                </p>

                <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">
                        Didn't receive the email?{' '}
                        <button onClick={handleResend} className="font-medium text-[#545F71] hover:underline">
                            Resend verification link
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