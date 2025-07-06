import { createSlice } from '@reduxjs/toolkit';
import * as orderApi from '../../api/orderApi';

const initialState = {
    items: [],
    pagination: {
        size: 0,
        number: 0,
        totalElements: 0,
        totalPages: 0,
    },
    currentOrder: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {

        orderOperationStart: (state) => {
            state.status = 'loading'
            state.error = null
        },

        orderOperationFail: (state, action) => {
            state.status = 'failed'
            state.error = action.payload.error
        },

        fetchOrdersSuccess: (state, action) => {
            state.status = 'succeeded'
            const { content, page } = action.payload
            state.items = Array.isArray(content) ? content : []
            state.pagination = page
        },

        fetchOrderByIdSuccess: (state, action) => {
            state.status = 'succeeded'
            state.currentOrder = action.payload
        },

        updateOrderStatusSuccess: (state, action) => {
            state.status = 'succeeded'
            const updatedOrder = action.payload

            const index = state.items.findIndex(o => o.id === updatedOrder.id)
            if (index !== -1) {
                state.items[index] = updatedOrder
            }

            if (state.currentOrder?.id === updatedOrder.id) {
                state.currentOrder = updatedOrder
            }
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null
        }
    },
});

export const {
    orderOperationStart,
    orderOperationFail,
    fetchOrdersSuccess,
    fetchOrderByIdSuccess,
    updateOrderStatusSuccess,
    clearCurrentOrder,
} = orderSlice.actions

export const fetchBusinessOrders = (params = { page: 0, size: 10 }) => {
    return async (dispatch,getState) => {
        dispatch(orderOperationStart())

        try {
            const businessId = getState().business.details?.businessId
            const response = await orderApi.getBusinessOrders(businessId)
            console.log(response, '<<< cek order response');
            
            dispatch(fetchOrdersSuccess(response.data))
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(orderOperationFail({ error: errorMessage }))
        }
    }
}

export const fetchOrderById = (orderId) => {
    return async (dispatch) => {
        dispatch(orderOperationStart());
        try {
            const response = await orderApi.getOrderById(orderId)

            console.log(response, '<<< cek response oder by id');
            

            dispatch(fetchOrderByIdSuccess(response.data))
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(orderOperationFail({ error: errorMessage }))
        }
    }
}

export const changeOrderStatus = ({ orderId, payload }) => {
    return async (dispatch) => {
        dispatch(orderOperationStart())
        try {
            const response = await orderApi.updateOrderStatus(orderId, payload)
            dispatch(updateOrderStatusSuccess(response.data))
            return response
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            dispatch(orderOperationFail({ error: errorMessage }))
            throw new Error(errorMessage)
        }
    }
}

export default orderSlice.reducer