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

export const createNewProduct = (productData) => {
    return async (dispatch, getState) => {
        dispatch(productOperationStart())
        try {
            const businessId = getState().business.details?.businessId
            
            if (!businessId) {
                throw new Error("Business ID not found. Please reload.")
            }

            console.log(productData, 'cek product data');

            
            
            const formData = new FormData()
            const detailsWithBusinessId = { ...productData, businessId: businessId }
            console.log(detailsWithBusinessId, '<< cek payload create');
            formData.append('product', new Blob([JSON.stringify(detailsWithBusinessId)], { type: "application/json" }))
            
            if (productData.imageUrl) {
                formData.append('image', productData.imageUrl)
            }

            const response = await productApi.createProduct(formData)
            // const response = await productApi.createProduct(detailsWithBusinessId)
            dispatch(createProductSuccess({ product: response.data }))
            return response

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(productOperationFail({ error: errorMessage }))
            throw new Error(errorMessage)
        }
    };
};

export const updateExistingProduct = ({ productId, productData }) => {
    return async (dispatch, getState) => {
        dispatch(productOperationStart());
        try {
            const businessId = getState().business.details?.id
            if (!businessId) {
                throw new Error("Business ID not found. Please reload.")
            }

            const formData = new FormData();
            // const detailsWithBusinessId = { ...productData.details, business_id: businessId }
            formData.append('product', new Blob([JSON.stringify(productData.details)], { type: "application/json" }))

            if (productData.image && typeof productData.image !== 'string') {
                formData.append('image', productData.image)
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