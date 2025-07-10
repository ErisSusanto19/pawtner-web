import axiosInstance from './axiosInstance'

export const getMyProducts = async (businessId, params) => {
    const response = await axiosInstance.get(`/products/my-products/${businessId}`, params)
    return response.data
}

export const getProductById = async (productId) => {
    const response = await axiosInstance.get(`/products/${productId}`)
    return response.data
}

export const createProduct = async (formData) => {
    const response = await axiosInstance.post('/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const updateProduct = async (productId, formData) => {
    const response = await axiosInstance.put(`/products/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const deleteProduct = async (productId) => {
    const response = await axiosInstance.delete(`/products/${productId}`)
    return response.data
}