import { createSlice } from '@reduxjs/toolkit';
import * as productApi from '../../api/productApi';
// import { toast } from 'react-toastify'

const initialState = {
    items: [],
    pagination: {
        size: 0,
        number: 0,
        totalElements: 0,
        totalPages: 0,
    },
    currentItem: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {

        productOperationStart: (state) => {
            state.status = 'loading'
            state.error = null
        },

        productOperationFail: (state, action) => {
            state.status = 'failed'
            state.error = action.payload.error
        },

        fetchProductsSuccess: (state, action) => {
            state.status = 'succeeded'
            const { content, page } = action.payload
            state.items = Array.isArray(content) ? content : []
            state.pagination = page
        },

        fetchProductByIdSuccess: (state, action) => {
            state.status = 'succeeded';
            state.currentItem = action.payload;
        },

        createProductSuccess: (state, action) => {
            state.status = 'succeeded'
            state.items.unshift(action.payload.product)
        },

        updateProductSuccess: (state, action) => {
            state.status = 'succeeded'
            const updatedProduct = action.payload.product
            const index = state.items.findIndex(p => p.id === updatedProduct.id)
            if (index !== -1) {
                state.items[index] = updatedProduct
            }
            if (state.currentItem?.id === updatedProduct.id) {
                state.currentItem = updatedProduct
            }
        },

        deleteProductSuccess: (state, action) => {
            state.status = 'succeeded'
            const productId = action.payload.productId
            state.items = state.items.filter(p => p.id !== productId)
        },

        setCurrentProduct: (state, action) => {
            state.currentItem = action.payload
        },
    },
})

export const {
    productOperationStart,
    productOperationFail,
    fetchProductsSuccess,
    fetchProductByIdSuccess,
    createProductSuccess,
    updateProductSuccess,
    deleteProductSuccess,
    setCurrentProduct,
} = productSlice.actions

export const fetchProducts = (pageNumber = 0) => {
    return async (dispatch) => {
        dispatch(productOperationStart())
        try {
            const response = await productApi.getMyProducts(pageNumber)
            dispatch(fetchProductsSuccess(response.data))
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(productOperationFail({ error: errorMessage }))
        }
    }
}

export const fetchProductById = (productId) => {
    return async (dispatch) => {
        dispatch(productOperationStart())
        try {
            const productData = await productApi.getProductById(productId)
            dispatch(fetchProductByIdSuccess(productData.data))
            return productData
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(productOperationFail({ error: errorMessage }))
            throw new Error(errorMessage)
        }
    }
}

export const createNewProduct = (productData) => {
    return async (dispatch, getState) => {
        dispatch(productOperationStart())
        try {
            const businessId = getState().business.details?.businessId
            
            if (!businessId) {
                throw new Error("Business ID not found. Please reload.")
            }

            const formData = new FormData()
            const detailsWithBusinessId = { ...productData, businessId: businessId }

            formData.append("businessId", businessId)
            formData.append("name", productData.name)
            formData.append("category", productData.category)
            formData.append("price", productData.price)
            formData.append("stockQuantity", productData.stockQuantity)
            formData.append("description", productData.description)
            formData.append("isActive", productData.isActive)
            
            if (productData.imageUrl) {
                formData.append('image', productData.imageUrl)
            }

            const response = await productApi.createProduct(formData)
            dispatch(createProductSuccess({ product: response.data }))
            return response

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(productOperationFail({ error: errorMessage }))
            throw new Error(errorMessage)
        }
    };
}

export const updateExistingProduct = ({ productId, productData }) => {
    return async (dispatch, getState) => {
        dispatch(productOperationStart());
        try {
            const businessId = getState().business.details?.businessId
            if (!businessId) {
                throw new Error("Business ID not found. Please reload.")
            }
            
            const formData = new FormData();
            const detailsWithBusinessId = { ...productData, businessId }

            formData.append("businessId", businessId)
            formData.append("name", productData.name)
            formData.append("category", productData.category)
            formData.append("price", productData.price)
            formData.append("stockQuantity", productData.stockQuantity)
            formData.append("description", productData.description)
            formData.append("isActive", productData.isActive)

            if (productData.imageUrl && typeof productData.imageUrl !== 'string') {
                formData.append('image', productData.imageUrl)
            }
            
            const response = await productApi.updateProduct(productId, formData)
            dispatch(updateProductSuccess({ product: response.data }))
            return response

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(productOperationFail({ error: errorMessage }))
            throw new Error(errorMessage)
        }
    }
}

export const deleteExistingProduct = (productId) => {
    return async (dispatch) => {
        dispatch(productOperationStart())
        try {
            const response = await productApi.deleteProduct(productId)
            console.log(response, 'cek response after delete');
            
            dispatch(deleteProductSuccess({ productId }))
            return response

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(productOperationFail({ error: errorMessage }))
            throw new Error(errorMessage)
        }
    }
}

export default productSlice.reducer