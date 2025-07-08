import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { checkUserSession } from '../store/slices/authSlice';

const FullPageLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fa' }}>
        <p style={{ fontSize: '1.2rem', color: '#495057' }}>Loading application...</p>
    </div>
)

const RootLayout = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const { token, user, isAuthenticated } = useSelector((state) => state.auth)
     const { business } = useSelector((state) => state.business)
    
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
        return <FullPageLoader />
    }

    const publicPaths = ['/signin', '/signup', '/verify-email', '/forgot-password', '/reset-password'] 
    const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path))

    if (isAuthenticated) {
        if (isPublicPath) {
            return <Navigate to="/" replace />
        }

        if (user) {
            if (typeof user.hasBusiness === 'undefined' || user.hasBusiness === null) {
                return <FullPageLoader />
            }

            const isRegisterPage = location.pathname.includes('/register-business')

            if (user.hasBusiness === true && isRegisterPage) {
                return <Navigate to="/" replace />
            }

            if (user.hasBusiness && business) {
                const isApproved = business.statusApproved === 'Approved';
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

    return <FullPageLoader />
}

export default RootLayout;