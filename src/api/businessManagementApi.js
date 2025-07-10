import axiosAdminInstance from "./axiosAdminInstance";

export const getAllBusinesses = async(params) => {
    const response = await axiosAdminInstance.get(`/business`, params)
    return response.data
}

export const getBusinessById = async(businessId) => {
    const response = await axiosAdminInstance.get(`/business/${businessId}`)
    return response.data
}

export const approveBusiness = async(businessId, statusApprove) => {
    const response = await axiosAdminInstance.patch(`/business/${businessId}`, statusApprove)
    return response.data
}