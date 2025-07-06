import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import adminAuthReducer from './slices/adminAuthSlice';
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'
import serviceReducer from './slices/serviceSlice'
import bookingReducer from './slices/bookingSlice'

import { injectStore } from '../api/axiosInstance'

const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    adminAuth: adminAuthReducer,
    products: productReducer,
    orders: orderReducer,
    services: serviceReducer,
    bookings: bookingReducer
  },
})

injectStore(store)

export default store