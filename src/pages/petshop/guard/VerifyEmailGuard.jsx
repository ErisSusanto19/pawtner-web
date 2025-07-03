import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const VerifyEmailGuard = () => {
    const { status } = useSelector((state) => state.auth)

    if (status === 'registered') {
        return <Outlet />
    }

    return <Navigate to="/signup" replace />
}

export default VerifyEmailGuard