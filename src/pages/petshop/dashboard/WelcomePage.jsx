import { useNavigate } from 'react-router-dom';
import { Store, CheckCircle } from 'lucide-react';
import WelcomeIllustrationURL from '../../../assets/undraw_landing-page_tsx8.svg'

const WelcomePage = ({ userName }) => {
    const navigate = useNavigate()

    const handleCreateBusiness = () => {
        navigate('/register-bussiness')
    }

    return (
        <div className="flex items-center justify-center h-full p-4 my-8">
            <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-lg shadow-md text-center">
                
                <div className="px-4">
                    <img 
                        src={WelcomeIllustrationURL} 
                        alt="A person setting up their online store" 
                        className="w-full h-auto max-w-sm mx-auto" 
                    />
                </div>
                
                <h1 className="text-3xl font-bold text-[#495057] mt-6">
                    Welcome, {userName}!
                </h1>

                <p className="mt-4 text-lg text-gray-600">
                    Your account has been successfully verified. Just one more step to start selling your pet products and services.
                </p>

                <div className="mt-8">
                    <button
                        onClick={handleCreateBusiness}
                        className="w-full sm:w-auto px-12 py-3 text-lg font-semibold text-white bg-[#545F71] rounded-lg hover:bg-[#495057] transition-colors shadow-lg transform hover:scale-105"
                    >
                        Complete Your Store Information
                    </button>
                </div>

                <div className="mt-10 text-left text-sm text-gray-500 space-y-2">
                    <p className="font-semibold">Once completed, you will be able to:</p>
                    <div className="flex items-center"><CheckCircle size={16} className="text-green-500 mr-2" /> Manage products and services.</div>
                    <div className="flex items-center"><CheckCircle size={16} className="text-green-500 mr-2" /> Receive orders and booking schedules.</div>
                    <div className="flex items-center"><CheckCircle size={16} className="text-green-500 mr-2" /> View your store’s revenue reports.</div>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage