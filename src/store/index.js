import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'
import serviceReducer from './slices/serviceSlice'
import bookingReducer from './slices/bookingSlice'
import prescriptionReducer from './slices/prescriptionSlice'

import adminAuthReducer from './slices/adminAuthSlice';
import userManagementReducer from './slices/userManagementSlice'
import businessManagementReducer from './slices/businessManagementSlice'

import { injectStore } from '../api/axiosInstance'

const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    adminAuth: adminAuthReducer,
    products: productReducer,
    orders: orderReducer,
    services: serviceReducer,
    bookings: bookingReducer,
    prescriptions: prescriptionReducer,
    userManagement: userManagementReducer,
    businessManagement: businessManagementReducer,
  },
})

injectStore(store)

export default store