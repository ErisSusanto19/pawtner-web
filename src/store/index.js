import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import adminAuthReducer from './slices/adminAuthSlice';
import productReducer from './slices/productSlice'

import { injectStore } from '../api/axiosInstance'

const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    adminAuth: adminAuthReducer,
    products: productReducer
  },
})

injectStore(store)

export default store