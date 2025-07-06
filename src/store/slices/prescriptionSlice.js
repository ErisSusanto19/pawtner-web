import { createSlice } from '@reduxjs/toolkit';
import * as prescriptionApi from '../../api/prescriptionApi';

const initialState = {
    items: [],
    pagination: {},
    currentItem: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const prescriptionSlice = createSlice({
    name: 'prescriptions',
    initialState,
    reducers: {
        operationStart: (state) => {
            state.status = 'loading'
            state.error = null
        },
        operationFail: (state, action) => {
            state.status = 'failed'
            state.error = action.payload.error
        },
        fetchPrescriptionsSuccess: (state, action) => {
            state.status = 'succeeded'
            state.items = action.payload.content || []
            state.pagination = action.payload.page || {}
        },
        fetchPrescriptionByIdSuccess: (state, action) => {
            state.status = 'succeeded'
            state.currentItem = action.payload
        },
        createPrescriptionSuccess: (state, action) => {
            state.status = 'succeeded'
            state.items.unshift(action.payload)
        },
        deletePrescriptionSuccess: (state, action) => {
            state.status = 'succeeded'
            const deletedId = action.payload.id
            state.items = state.items.filter(item => item.id !== deletedId)
        },
        clearCurrentPrescription: (state) => {
            state.currentItem = null
        },
    },
})

export const {
    operationStart,
    operationFail,
    fetchPrescriptionsSuccess,
    fetchPrescriptionByIdSuccess,
    createPrescriptionSuccess,
    deletePrescriptionSuccess,
    clearCurrentPrescription,
} = prescriptionSlice.actions

export const createNewPrescription = (payload) => async (dispatch) => {
    dispatch(operationStart())
    try {
        const response = await prescriptionApi.createPrescription(payload)
        dispatch(createPrescriptionSuccess(response.data))
        return response
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(operationFail({ error: errorMessage }))
        throw error
    }
}

export const fetchPrescriptions = (params) => async (dispatch) => {
    dispatch(operationStart())
    try {
        const response = await prescriptionApi.getPrescriptions(params)
        dispatch(fetchPrescriptionsSuccess(response.data))
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(operationFail({ error: errorMessage }))
    }
}

export default prescriptionSlice.reducer