import axiosInstance from './axiosInstance'

export const getMyProducts = async () => {
    const response = await axiosInstance.get('/products')
    return response.data
}

export const getProductById = async (productId) => {
    const response = await axiosInstance.get(`/products/${productId}`)
    return response.data
}

export const createProduct = async (formData) => {
    const response = await axiosInstance.post('/products', formData, {
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const updateProduct = async (productId, formData) => {
    const response = await axiosInstance.post(`/products/${productId}`, formData, {
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