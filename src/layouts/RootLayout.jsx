import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { checkUserSession } from '../store/slices/authSlice';
import PageLoader from '../components/PageLoader';

const RootLayout = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const { token, user, isAuthenticated } = useSelector((state) => state.auth)
    const { details } = useSelector((state) => state.business)
    // console.log(details, 'cek business from root')
    
    const [isSessionChecked, setIsSessionChecked] = useState(false)

    useEffect(() => {
        if (token && !isSessionChecked) {
            dispatch(checkUserSession()).finally(() => {
                setIsSessionChecked(true)
            });
        } else {
            if (!isSessionChecked) setIsSessionChecked(true)
        }
    }, [dispatch, token, isSessionChecked])

    if (!isSessionChecked) {
        return <PageLoader message="Loading application..."/>
    }

    const publicPaths = ['/signin', '/signup', '/verify-email', '/forgot-password', '/reset-password'] 
    const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path))

    if (isAuthenticated) {
        if (isPublicPath) {
            return <Navigate to="/" replace />
        }

        if (user) {
            if (typeof user.hasBusiness === 'undefined' || user.hasBusiness === null) {
                return <PageLoader message="Loading application..."/>
            }

            const isRegisterPage = location.pathname.includes('/register-business')

            if (user.hasBusiness === true && isRegisterPage) {
                return <Navigate to="/" replace />
            }

            if (user.hasBusiness && details) {
                const isApproved = details.statusApproved === 'Approved';
                const alwaysEnabledPaths = ['/', '/settings', '/register-business'];
                const isTryingToAccessRestricted = !alwaysEnabledPaths.some(p => location.pathname.startsWith(p));

                if (!isApproved && isTryingToAccessRestricted) {
                    return <Navigate to="/" replace />;
                }
            }
        }

        return <Outlet />
    }

    if (!isAuthenticated) {
        if (isPublicPath) {
            return <Outlet />
        }
        
        return <Navigate to="/signin" state={{ from: location }} replace />
    }

    return <PageLoader message="Loading application..."/>
}

export default RootLayout;