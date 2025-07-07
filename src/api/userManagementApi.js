import axiosInstance from "./axiosInstance";

export const getAllUsers = async () => {
    const response = await axiosInstance.get('/users')
    return response.data
}

export const getUserById = async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`)
    return response.data
}

export const toggleUserStatus = async (userId, action, value) => {
    const response = await axiosInstance.patch(`/users/${userId}/status`, null, {
        params: {
            action,
            value
        }
    })
    return response.data
}