import axiosInstance from './axiosInstance'

export const getMyServices = async (businessId, params) => {
    const response = await axiosInstance.get(`/services/my-services/${businessId}`, params)
    return response.data
}

export const getServiceById = async (serviceId) => {
    const response = await axiosInstance.get(`/services/${serviceId}`)
    return response.data
}

export const createService = async (serviceData) => {
    const response = await axiosInstance.post('/services', serviceData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const updateService = async (serviceId, serviceData) => {
    const response = await axiosInstance.put(`/services/${serviceId}`, serviceData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const deleteService = async (serviceId) => {
    const response = await axiosInstance.delete(`/services/${serviceId}`)
    return response.data
}