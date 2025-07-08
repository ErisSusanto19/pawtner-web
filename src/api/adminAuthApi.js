import axiosAdminInstance from "./axiosAdminInstance";

export const loginAdmin = async (credentials) => {
    const response = await axiosAdminInstance.post(`/auth/login`, credentials)
    return response.data
}

export const updateAdminPassword = async (passwordData) => {
    const response = await axiosAdminInstance.put(`/admin/auth/change-password`, passwordData)
    return response.data
}