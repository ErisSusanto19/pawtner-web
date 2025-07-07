import axiosInstance from "./axiosInstance";

export const getAllBusinesses = async() => {
    const response = await axiosInstance.get(`/business`)
    return response.data
}

export const getBusinessById = async(businessId) => {
    const response = await axiosInstance.get(`/business/${businessId}`)
    return response.data
}

export const approveBusiness = async(businessId, statusApprove) => {
    const response = await axiosInstance.patch(`/business/${businessId}`, statusApprove)
    return response.data
}