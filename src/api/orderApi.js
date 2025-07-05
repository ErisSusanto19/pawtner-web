import axiosInstance from './axiosInstance';

export const getBusinessOrders = async (params) => {
    const response = await axiosInstance.get('/business/orders', { params })
    return response.data
}

export const getOrderById = async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}`)
    return response.data
}

export const updateOrderStatus = async (orderId, payload) => {
    const response = await axiosInstance.patch(`/orders/${orderId}/status`, payload)
    return response.data
}