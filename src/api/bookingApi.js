import axiosInstance from './axiosInstance';

export const getBusinessBookings = async (businessId, params) => {
    const response = await axiosInstance.get(`/bookings/my-bookings/${businessId}`, params)
    return response.data
}
// export const getBusinessBookings = async (businessId, params) => {
//     const response = await axiosInstance.get(`/bookings`, { 
//         params: { page:0, size: 50 }
//      })
//     return response.data
// }

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