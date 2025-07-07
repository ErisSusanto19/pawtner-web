import axiosInstance from './axiosInstance';

export const getBusinessOrders = async (id, params) => {
    const response = await axiosInstance.get(`/orders/business?businessId=${id}`, { params })
    return response.data
}

export const getOrderById = async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}`)
    return response.data
}

export const updateOrderStatus = async (orderId, payload) => {
    console.log(payload);
    
    const response = await axiosInstance.put(`/orders/${orderId}/status`, null, {
        params: { status: payload.status }
    })
    return response.data
}