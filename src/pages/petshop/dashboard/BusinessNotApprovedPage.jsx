import { MailWarning, ShieldAlert } from 'lucide-react';
import PendingIllustrationURL from '../../../assets/undraw_pending-approval_6cdu.svg';

const BusinessNotApprovedPage = () => {
    return (
        <div className="flex items-center justify-center h-full p-4 my-16">
            <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-lg shadow-md text-center">

                <div className="px-4">
                    <img 
                        src={PendingIllustrationURL} 
                        alt="Business approval pending illustration" 
                        className="w-full h-auto max-w-sm mx-auto" 
                    />
                </div>

                <h1 className="text-3xl font-bold text-[#495057] mt-6">
                    Your Store is Under Review
                </h1>

                <p className="mt-4 text-lg text-gray-600">
                    Thank you for submitting your store information. Our team is currently reviewing your application.
                </p>

                <div className="mt-6 text-sm text-gray-600 space-y-3 text-left">
                    <div className="flex items-start">
                        <ShieldAlert size={18} className="text-yellow-500 mt-0.5 mr-2" />
                        <span>
                            While under review, you won’t be able to access the full features of the dashboard.
                        </span>
                    </div>
                    <div className="flex items-start">
                        <MailWarning size={18} className="text-blue-500 mt-0.5 mr-2" />
                        <span>
                            You will receive an email notification once your store has been approved.
                        </span>
                    </div>
                </div>

                <div className="mt-8 text-sm text-gray-500">
                    If you have any questions, feel free to contact our support team.
                </div>
            </div>
        </div>
    )
}

export default BusinessNotApprovedPage;