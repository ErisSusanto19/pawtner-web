import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import adminAuthReducer from './slices/adminAuthSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    adminAuth: adminAuthReducer
  },
})

export default store