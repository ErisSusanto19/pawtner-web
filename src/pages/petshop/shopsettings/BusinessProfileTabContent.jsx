import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBusiness } from '../../../store/slices/businessSlice';
import BusinessProfileForm from './BusinessProfileForm';
import NoBusinessProfile from './NoBusinessProfile';

const FullPageLoader = () => (
    <div className="p-6 text-center text-gray-500">
        Loading Business Profile...
    </div>
);

const BusinessProfileTabContent = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { details: business, status, error } = useSelector((state) => state.business)

    const hasBusiness = user?.hasBusiness

    useEffect(() => {
        if (hasBusiness && !business && status !== 'loading') {
            dispatch(fetchMyBusiness())
        }
    }, [dispatch, hasBusiness, business, status])

    if (!hasBusiness) {
        return <NoBusinessProfile />
    }

    if (status === 'loading') {
        return <FullPageLoader />
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">Error: {error}</div>
    }
    
    if (hasBusiness && business) {
        return <BusinessProfileForm initialData={business} />
    }

    return <NoBusinessProfile />
}

export default BusinessProfileTabContent