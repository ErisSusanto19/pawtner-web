import { MailWarning, ShieldX } from 'lucide-react';
import RejectedIllustrationURL from '@/assets/undraw_cancel_7zdh.svg';

const BusinessRejectedPage = () => {
    return (
        <div className="flex items-center justify-center h-full p-4 my-16">
            <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-lg shadow-md text-center">

                <div className="px-4">
                    <img 
                        src={RejectedIllustrationURL} 
                        alt="Business rejected illustration" 
                        className="w-full h-auto max-w-sm mx-auto" 
                    />
                </div>

                <h1 className="text-3xl font-bold text-[#495057] mt-6">
                    Your Store Submission was Rejected
                </h1>

                <p className="mt-4 text-lg text-gray-600">
                    Unfortunately, your store application did not meet the current approval criteria.
                </p>

                <div className="mt-6 text-sm text-gray-600 space-y-3 text-left">
                    <div className="flex items-start">
                        <MailWarning size={18} className="text-blue-500 mt-0.5 mr-2" />
                        <span>
                            Please check your email for details about why your application was rejected.
                        </span>
                    </div>
                    <div className="flex items-start">
                        <ShieldX size={18} className="text-red-500 mt-0.5 mr-2" />
                        <span>
                            You can still access your business profile through the <strong>Settings</strong> page to make the necessary changes.
                        </span>
                    </div>
                </div>

                <div className="mt-8 text-sm text-gray-500">
                    Once you have updated your store information, please wait for a re-review.  
                    If you need assistance, feel free to contact our support team.
                </div>
            </div>
        </div>
    )
}

export default BusinessRejectedPage;