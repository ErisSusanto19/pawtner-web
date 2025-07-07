import { createSlice } from '@reduxjs/toolkit';
import * as prescriptionApi from '../../api/prescriptionApi';

const initialState = {
    items: [],
    pagination: {},
    currentItem: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const prescriptionSlice = createSlice({
    name: 'prescriptions',
    initialState,
    reducers: {
        operationStart: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        operationFail: (state, action) => {
            state.status = 'failed';
            state.error = action.payload.error;
        },
     
        fetchPrescriptionsSuccess: (state, action) => {
            state.status = 'succeeded';
            const prescriptionData = action.payload;
            state.items = prescriptionData ? [prescriptionData] : [];
        },

        fetchPrescriptionByIdSuccess: (state, action) => {
            state.status = 'succeeded';
            state.currentItem = action.payload;
        },

        createPrescriptionSuccess: (state, action) => {
            state.status = 'succeeded';
            state.items = [action.payload];
        },

        deletePrescriptionSuccess: (state, action) => {
            state.status = 'succeeded';
            state.items = [];
        },

        clearPrescriptions: (state) => {
            state.items = [];
            state.currentItem = null;
            state.status = 'idle';
            state.error = null;
        },
    },
});

export const {
    operationStart,
    operationFail,
    fetchPrescriptionsSuccess,
    fetchPrescriptionByIdSuccess,
    createPrescriptionSuccess,
    deletePrescriptionSuccess,
    clearPrescriptions,
} = prescriptionSlice.actions

export const fetchPrescriptionsByBooking = (bookingId) => async (dispatch) => {
    dispatch(operationStart());
    try {
        const response = await prescriptionApi.getPrescriptionsByBookingId(bookingId);
        dispatch(fetchPrescriptionsSuccess(response.data));
    } catch (error) {
        if (error.response && error.response.status === 404) {
            dispatch(fetchPrescriptionsSuccess(null));
        } else {
            const errorMessage = error.response?.data?.message || error.message;
            dispatch(operationFail({ error: errorMessage }));
        }
    }
};

export const createNewPrescription = (payload) => async (dispatch) => {
    dispatch(operationStart());
    try {
        const response = await prescriptionApi.createPrescription(payload);
        dispatch(createPrescriptionSuccess(response.data));
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(operationFail({ error: errorMessage }));
        throw error;
    }
};

export const deleteExistingPrescription = (prescriptionId) => async (dispatch) => {
    dispatch(operationStart());
    try {
        await prescriptionApi.deletePrescription(prescriptionId);
        dispatch(deletePrescriptionSuccess());
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(operationFail({ error: errorMessage }));
    }
};


export default prescriptionSlice.reducer