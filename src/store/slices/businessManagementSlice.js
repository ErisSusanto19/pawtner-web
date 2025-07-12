import { createSlice } from '@reduxjs/toolkit';
import * as businessManagementApi from '../../api/businessManagementApi'; 

const initialState = {
  items: [],
  selectedBusiness: null,
  isLoading: false,
  error: null,
  status: 'idle',
};

const businessManagementSlice = createSlice({
  name: 'businessManagement',
  initialState,
  reducers: {
    operationStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.status = 'loading';
    },

    operationFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
      state.status = 'failed';
    },

    fetchAllBusinessesSuccess: (state, action) => {
      if (action.payload && Array.isArray(action.payload.data)) {
        state.items = action.payload.data
      } else {
        state.items = []
        console.error("fetchAllBusinessesSuccess received invalid data:", action.payload)
      }
      state.isLoading = false;
      state.status = 'succeeded';
    },

    fetchBusinessByIdSuccess: (state, action) => {
      const response = action.payload;
      state.selectedBusiness = response.data;
      state.isLoading = false;
      state.status = 'succeeded';
    },

    updateBusinessSuccess: (state, action) => {
      const updatedBusiness = action.payload;
      const index = state.items.findIndex(biz => biz.businessId === updatedBusiness.businessId);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updatedBusiness };
      }
      if (state.selectedBusiness && state.selectedBusiness.businessId === updatedBusiness.businessId) {
        state.selectedBusiness = { ...state.selectedBusiness, ...updatedBusiness };
      }
      state.isLoading = false;
      state.status = 'succeeded';
    },

    clearSelectedBusiness: (state) => {
      state.selectedBusiness = null;
    }
  },
});

export const {
  operationStart,
  operationFail,
  fetchAllBusinessesSuccess,
  fetchBusinessByIdSuccess,
  updateBusinessSuccess,
  clearSelectedBusiness
} = businessManagementSlice.actions;

export const fetchAllBusinesses = (params = {page: 0, size: 20}) => async (dispatch) => {
  dispatch(operationStart());
  try {
    const response = await businessManagementApi.getAllBusinesses(params);
    console.log(response, 'cek from thunk');
    
    dispatch(fetchAllBusinessesSuccess(response));
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch businesses.';
    dispatch(operationFail({ error: errorMessage }));
    throw new Error(errorMessage);
  }
};

export const fetchBusinessById = (businessId) => async (dispatch) => {
  dispatch(operationStart());
  try {
    const data = await businessManagementApi.getBusinessById(businessId);
    dispatch(fetchBusinessByIdSuccess(data));
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch business details.';
    dispatch(operationFail({ error: errorMessage }));
    throw new Error(errorMessage);
  }
};

export const approveOrRejectBusiness = (businessId, isApproved, reason) => async (dispatch) => {
  dispatch(operationStart())
  try {
    const requestBody = { 
      approve: isApproved,
      reason
    }
    const response = await businessManagementApi.approveBusiness(businessId, requestBody)

    dispatch(updateBusinessSuccess(response.data)); 
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update business status.';
    dispatch(operationFail({ error: errorMessage }));
    throw new Error(errorMessage);
  }
};

export default businessManagementSlice.reducer