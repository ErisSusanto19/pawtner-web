import axiosInstance from './axiosInstance';

export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register/business-owner', userData)
  return response.data
}

export const verifyEmail = async (verificationData) => {
  const response = await axiosInstance.post('/auth/verify', verificationData)
  return response.data
}

export const resendVerificationEmail = async (emailData) => {
  const response = await axiosInstance.post('/auth/resend-verification', emailData)
  return response.data
}

export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials)
  return response.data
}

export const getProfile = async (id) => {
  const response = await axiosInstance.get(`/users/${id}`)
  return response.data
}

export const updateProfile = async (formData) => {
  const response = await axiosInstance.put('/users', formData)
  return response.data
}

export const changePassword = async (passwordData) => {
    const response = await axiosInstance.put('/user/change-password', passwordData)
    return response.data
}