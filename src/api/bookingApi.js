import axiosInstance from './axiosInstance';

export const getBusinessBookings = async (params) => {
    const response = await axiosInstance.get('/bookings', { params })
    return response.data
}

export const getBookingById = async (bookingId) => {
    const response = await axiosInstance.get(`/bookings/${bookingId}`)
    return response.data
}

export const updateBookingStatus = async (bookingId, status) => {
    const response = await axiosInstance.put(
        `/bookings/${bookingId}/status`,
        status,
        {
            headers: {
                'Content-Type': 'text/plain'
            }
        }
    )
    return response.data
}