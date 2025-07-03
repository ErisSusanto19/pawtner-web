import { Link } from 'react-router-dom';
import { Building, ArrowRight } from 'lucide-react';

const CompleteProfileBanner = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6" role="alert">
      <div className="flex items-center">
        <div className="py-1">
          <Building className="h-6 w-6 text-yellow-600 mr-4" />
        </div>
        <div>
          <p className="font-bold">Your Business Profile is Incomplete</p>
          <p className="text-sm">
            You need to complete your business profile to access all features, like managing products and orders.
          </p>
        </div>
        <div className="ml-auto">
          <Link
            to="/register-business"
            className="flex items-center px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-md hover:bg-yellow-600 transition-colors"
          >
            Complete Now
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfileBanner