import axiosInstance from "./axiosInstance";

export const registerBusiness = async (data) => {
    const response = await axiosInstance.post('/business/register', data)
    return response.data
}

export const getBusinessById = async (id) => {
    const response = await axiosInstance.get(`/business/${id}`)
    return response.data
}

export const getMyBusiness = async () => {
    const response = await axiosInstance.get('/business/my-business')
    return response.data
}