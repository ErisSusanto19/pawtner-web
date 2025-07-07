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

    // Ditambahkan '/reset-password' untuk menangani kasus di luar children RootLayout
    const publicPaths = ['/signin', '/signup', '/verify-email', '/forgot-password', '/reset-password'] 
    const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path))

    if (isAuthenticated) {
        if (isPublicPath) {
            return <Navigate to="/" replace />
        }

        if (user) {
            // Loader untuk menunggu status 'hasBusiness' selesai dihitung
            // user.hasBusiness === null adalah asumsi dari kode Anda, undefined lebih aman
            if (typeof user.hasBusiness === 'undefined' || user.hasBusiness === null) {
                return <FullPageLoader />
            }

            const isRegisterPage = location.pathname.includes('/register-business')

            // Logika ini DIPERTAHANKAN: mencegah user yang SUDAH punya bisnis mengakses halaman registrasi.
            if (user.hasBusiness === true && isRegisterPage) {
                return <Navigate to="/" replace />
            }
            
            // Logika ini DIHAPUS karena inilah yang menyebabkan paksaan.
            /*
            if (user.hasBusiness === false && !isRegisterPage) {
                return <Navigate to="/register-business" replace />;
            }
            */
        }

        return <Outlet />
    }

    if (!isAuthenticated) {
        if (isPublicPath) {
            return <Outlet />
        }
        
        // Ditambahkan state `from` untuk pengalaman pengguna yang lebih baik setelah login.
        return <Navigate to="/signin" state={{ from: location }} replace />
    }

    return <FullPageLoader />
}

export default RootLayout;