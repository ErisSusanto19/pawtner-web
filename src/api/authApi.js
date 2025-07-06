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
  const response = await axiosInstance.put('/users', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const requestPasswordReset = async (emailPayload) => {
  const response = await axiosInstance.post('/auth/forgot-password', emailPayload)
  return response.data
}

export const resetPassword = async (resetPayload) => {
  const response = await axiosInstance.post('/auth/reset-password', resetPayload)
  return response.data
}