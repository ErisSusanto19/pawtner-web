import { createSlice } from '@reduxjs/toolkit';
import * as serviceApi from '../../api/serviceApi';
// import { toast } from 'react-toastify';

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

const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        serviceOperationStart: (state) => {
            state.status = 'loading'
            state.error = null
        },
        serviceOperationFail: (state, action) => {
            state.status = 'failed'
            state.error = action.payload.error
        },
        fetchServicesSuccess: (state, action) => {
            state.status = 'succeeded'
            const { content, page } = action.payload
            state.items = Array.isArray(content) ? content.filter(item => item.isActive) : []
            state.pagination = page
        },
        fetchServiceByIdSuccess: (state, action) => {
            state.status = 'succeeded'
            state.currentItem = action.payload
        },
        createServiceSuccess: (state, action) => {
            state.status = 'succeeded'
            state.items.unshift(action.payload.service)
        },
        updateServiceSuccess: (state, action) => {
            state.status = 'succeeded'
            const updatedService = action.payload.service
            const index = state.items.findIndex(s => s.id === updatedService.id)
            if (index !== -1) {
                state.items[index] = updatedService
            }
            if (state.currentItem?.id === updatedService.id) {
                state.currentItem = updatedService
            }
        },
        deleteServiceSuccess: (state, action) => {
            state.status = 'succeeded'
            const { serviceId } = action.payload
            state.items = state.items.filter(s => s.id !== serviceId)
        },
        setCurrentService: (state, action) => {
            state.currentItem = action.payload
        },
    },
})

export const {
    serviceOperationStart,
    serviceOperationFail,
    fetchServicesSuccess,
    fetchServiceByIdSuccess,
    createServiceSuccess,
    updateServiceSuccess,
    deleteServiceSuccess,
    setCurrentService,
} = serviceSlice.actions

export const fetchServices = (params = {}) => async (dispatch, getState) => {
    dispatch(serviceOperationStart())
    try {
        const businessId = getState().business.details?.businessId
        const response = await serviceApi.getMyServices(businessId, params)
        dispatch(fetchServicesSuccess(response.data));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(serviceOperationFail({ error: errorMessage }))
    }
}

export const fetchServiceById = (serviceId) => async (dispatch) => {
    dispatch(serviceOperationStart())
    try {
        const response = await serviceApi.getServiceById(serviceId)
        dispatch(fetchServiceByIdSuccess(response.data))
        return response
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(serviceOperationFail({ error: errorMessage }))
        throw error
    }
};

export const createNewService = (serviceData) => async (dispatch, getState) => {
    dispatch(serviceOperationStart())
    try {
        const businessId = getState().business.details?.businessId
        if (!businessId) {
            throw new Error("Business ID not found. Please reload.")
        }

        console.log(serviceData, businessId, '<<< cek payload');
        
        const formData = new FormData();
        formData.append("businessId", businessId);
        formData.append("name", serviceData.name);
        formData.append("category", serviceData.category);
        formData.append("description", serviceData.description);
        formData.append("basePrice", serviceData.basePrice);
        formData.append("capacityPerDay", serviceData.capacityPerDay);
        formData.append("isActive", serviceData.isActive);
        
        if (serviceData.imageUrl) {
            formData.append('image', serviceData.imageUrl);
        }

        const response = await serviceApi.createService(formData)
        dispatch(createServiceSuccess({ service: response.data }))
        return response
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(serviceOperationFail({ error: errorMessage }))
        throw error
    }
}

export const updateExistingService = ({ serviceId, serviceData }) => async (dispatch, getState) => {
    dispatch(serviceOperationStart())
    try {
        const businessId = getState().business.details?.businessId
        if (!businessId) {
            throw new Error("Business ID not found. Please reload.")
        }

        const formData = new FormData();
        formData.append("businessId", businessId);
        formData.append("name", serviceData.name);
        formData.append("category", serviceData.category);
        formData.append("description", serviceData.description);
        formData.append("basePrice", serviceData.basePrice);
        formData.append("capacityPerDay", serviceData.capacityPerDay);
        formData.append("isActive", serviceData.isActive);

        if (serviceData.imageUrl && typeof serviceData.imageUrl !== 'string') {
            formData.append('image', serviceData.imageUrl);
        }
        const response = await serviceApi.updateService(serviceId, formData)
        
        dispatch(updateServiceSuccess({ service: response.data }));
        return response
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(serviceOperationFail({ error: errorMessage }))
        throw error
    }
}

export const deleteExistingService = (serviceId) => async (dispatch) => {
    dispatch(serviceOperationStart())
    try {
        const response = await serviceApi.deleteService(serviceId)
        console.log(response, '<<< cek response delete')
        dispatch(deleteServiceSuccess({ serviceId }))
        return response
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        dispatch(serviceOperationFail({ error: errorMessage }))
        throw error
    }
}

export default serviceSlice.reducer