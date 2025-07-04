import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import adminAuthReducer from './slices/adminAuthSlice';

import { setupInterceptors } from '../api/axiosInstance'

const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    adminAuth: adminAuthReducer
  },
})

setupInterceptors(store)

export default store