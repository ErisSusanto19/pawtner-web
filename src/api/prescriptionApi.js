import axiosInstance from './axiosInstance';

export const createPrescription = async (payload) => {
    const response = await axiosInstance.post('/prescriptions', payload)
    return response.data
}

export const getPrescriptions = async (params) => {
    const response = await axiosInstance.get('/prescriptions', { params })
    return response.data
}

//Pakai yang ini
export const getPrescriptionsByBookingId = async (bookingId) => {
    const response = await axiosInstance.get(`/prescriptions/booking/${bookingId}`)
    return response.data
}

export const getPrescriptionById = async (prescriptionId) => {
    const response = await axiosInstance.get(`/prescriptions/${prescriptionId}`)
    return response.data
}

export const deletePrescription = async (prescriptionId) => {
    const response = await axiosInstance.delete(`/prescriptions/${prescriptionId}`)
    return response.data
}