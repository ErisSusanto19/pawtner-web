import axiosInstance from "./axiosInstance";

export const loginAdmin = async (credentials) => {
    const response = await axiosInstance.post(`/auth/login`, credentials)
    return response.data
}

export const updateAdminPassword = async (passwordData) => {
    const response = await axiosInstance.put(`/admin/auth/change-password`, passwordData)
    return response.data
}