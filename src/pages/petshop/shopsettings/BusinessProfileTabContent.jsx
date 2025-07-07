import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinessById, fetchMyBusiness } from '../../../store/slices/businessSlice';
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

    const businessId = useSelector((state) => state.business.details?.businessId)
    const hasBusiness = user?.hasBusiness

    useEffect(() => {
        // if (hasBusiness && !business && status !== 'loading') {
        //     dispatch(fetchMyBusiness())
        // }
        if (hasBusiness && businessId) {
            dispatch(fetchBusinessById(businessId));
        }
    }, [dispatch, hasBusiness, businessId])

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