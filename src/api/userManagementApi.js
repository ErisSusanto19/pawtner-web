import axiosAdminInstance from "./axiosAdminInstance";

export const getAllUsers = async () => {
    const response = await axiosAdminInstance.get('/users')
    return response.data
}

export const getUserById = async (userId) => {
    const response = await axiosAdminInstance.get(`/users/${userId}`)
    return response.data
}

export const toggleUserStatus = async (userId, action, value) => {
    const response = await axiosAdminInstance.patch(`/users/${userId}/status`, null, {
        params: {
            action,
            value
        }
    })
    return response.data
}