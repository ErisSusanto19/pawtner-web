import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const BusinessSetupGuard = () => {
    const { user } = useSelector((state) => state.auth)
    const location = useLocation()

    if (!user) {
        return <Outlet />
    }

    const hasBusiness = user.hasBusiness

    const allowedPaths = ['/', '/register-business', '/settings']

    if (hasBusiness) {
        return <Outlet />
    }

    if (!hasBusiness && allowedPaths.includes(location.pathname)) {
        return <Outlet />
    }

    if (!hasBusiness && !allowedPaths.includes(location.pathname)) {
        // return <Navigate to="/" replace />
        return <Navigate to="/register-business" replace />
    }

    return <Outlet />
}

export default BusinessSetupGuard