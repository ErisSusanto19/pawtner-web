import axios from "axios";
import axiosInstance from "./axiosInstance";

export const registerBusiness =  async (data, token) => {
    const response = await axios('https://c485-180-248-33-245.ngrok-free.app/api/business/register',{
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "nultipart/form-data"
        },
        data
    })
    return response.data
}

export const getBusinessById = async (id) => {
    const response = await axiosInstance.post(`/business/${id}`)
    return response.data
}

export const getMyBusiness = async () => {
    const response = await axiosInstance.get('/business/my-business')
    return response.data
}