import axiosAdminInstance from "./axiosAdminInstance";

export const getAllUsers = async (params) => {
    const response = await axiosAdminInstance.get('/users', params)
    return response.data
}

export const getUserById = async (userId) => {
    const response = await axiosAdminInstance.get(`/users/${userId}`)
    return response.data
}

export const toggleUserStatus = async (userId, action, value, reason, isSend) => {
    const response = await axiosAdminInstance.patch(`/users/${userId}/status`, {
        action,
        value,
        reason,
        isSend
    })
    return response.data
}