import { Link } from 'react-router-dom';
import { Building, ArrowRight } from 'lucide-react';

const NoBusinessProfile = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-8 text-center flex flex-col items-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Building size={32} className="text-[#545F71]" />
            </div>
            <h3 className="text-xl font-bold text-[#495057]">No Business Profile Found</h3>
            <p className="mt-2 text-gray-600 max-w-md">
                You haven't set up your business profile yet. Complete your profile to start managing products, services, and orders on Pawtner.
            </p>
            <Link
                to="/register-business"
                className="mt-6 flex items-center px-8 py-3 bg-[#545F71] text-white text-base font-semibold rounded-lg hover:bg-[#353f52] transition-colors"
            >
                Create Your Business Profile
                <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
        </div>
    )
}

export default NoBusinessProfile