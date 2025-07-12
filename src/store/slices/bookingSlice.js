import { createSlice } from '@reduxjs/toolkit';
import * as bookingApi from '../../api/bookingApi';
import { fetchServiceById } from './serviceSlice';

const initialState = {
    items: [],
    pagination: {
        size: 0,
        number: 0,
        totalElements: 0,
        totalPages: 0,
    },
    currentBooking: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        bookingOperationStart: (state) => {
            state.status = 'loading'
            state.error = null
        },
        bookingOperationFail: (state, action) => {
            state.status = 'failed'
            state.error = action.payload.error
        },
        fetchBookingsSuccess: (state, action) => {
            state.status = 'succeeded'
            const { content, page } = action.payload
            state.items = Array.isArray(content) ? content : []
            state.pagination = page
        },
        fetchBookingByIdSuccess: (state, action) => {
            state.status = 'succeeded'
            state.currentBooking = action.payload
        },
        fetchBookingWithDetailsServiceSuccess: (state, action) => {
            state.status = 'succeeded';
            state.currentBooking = action.payload;
        },
        updateBookingStatusSuccess: (state, action) => {
            state.status = 'succeeded'
            const updatedBooking = action.payload

            const index = state.items.findIndex(b => b.id === updatedBooking.id);
            if (index !== -1) {
                state.items[index] = updatedBooking
            }

            if (state.currentBooking?.id === updatedBooking.id) {
                state.currentBooking = updatedBooking
            }
        },
        clearCurrentBooking: (state) => {
            state.currentBooking = null
        }
    },
})

export const {
    bookingOperationStart,
    bookingOperationFail,
    fetchBookingsSuccess,
    fetchBookingByIdSuccess,
    fetchBookingWithDetailsServiceSuccess,
    updateBookingStatusSuccess,
    clearCurrentBooking,
} = bookingSlice.actions

export const fetchBusinessBookings = (params) => {
    return async (dispatch, getState) => {
        dispatch(bookingOperationStart())
        try {
            const businessId = getState().business.details?.businessId
            const response = await bookingApi.getBusinessBookings(businessId, params)
            console.log(response, '<<< cek response booking');
            
            dispatch(fetchBookingsSuccess(response.data))
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(bookingOperationFail({ error: errorMessage }))
            return Promise.reject(new Error(errorMessage))
        }
    }
}

export const fetchBookingById = (bookingId) => {
    return async (dispatch) => {
        dispatch(bookingOperationStart())
        try {
            const bookingResponse = await bookingApi.getBookingById(bookingId)
            console.log(bookingResponse, '<<< cek response booking by id');
            
            const basicBookingData = bookingResponse.data

            const { serviceId } = basicBookingData

            const serviceAction = await dispatch(fetchServiceById(serviceId))
            const serviceDetails = serviceAction.data

            const hydratedBooking = {
                ...basicBookingData,
                service: serviceDetails,
            }
            
            dispatch(fetchBookingWithDetailsServiceSuccess(hydratedBooking))

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(bookingOperationFail({ error: errorMessage }))
            return Promise.reject(new Error(errorMessage))
        }
    }
}

export const changeBookingStatus = ({ bookingId, status }) => {
    return async (dispatch) => {
        dispatch(bookingOperationStart())
        try {
            const response = await bookingApi.updateBookingStatus(bookingId, status)
            dispatch(updateBookingStatusSuccess(response.data))
            return response
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(bookingOperationFail({ error: errorMessage }))
            // throw new Error(errorMessage)
            return Promise.reject(new Error(errorMessage))
        }
    }
}

export default bookingSlice.reducer