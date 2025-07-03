import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { fetchUserProfile } from '../store/slices/authSlice'; 

const FullPageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fa' }}>
    <p style={{ fontSize: '1.2rem', color: '#495057' }}>Load the application...</p>
  </div>
)

const RootLayout = () => {
  const dispatch = useDispatch();
  const { token, user, status, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, token, user])

  if (status === 'loading' && token) {
    return <FullPageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }
  
  return <Outlet />
}

export default RootLayout