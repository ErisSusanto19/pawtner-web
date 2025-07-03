import { createSlice } from '@reduxjs/toolkit';
import { updateUserBusinessStatus } from './authSlice';

const initialState = {
  details: null,
  isLoading: false,
  error: null,
  status: 'idle',
}

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    businessOperationStart: (state) => {
      state.isLoading = true
      state.error = null
      state.status = 'loading'
    },
    businessOperationSuccess: (state, action) => {
      state.isLoading = false;
      state.details = action.payload.businessDetails
      state.status = 'succeeded'
    },
    businessOperationFail: (state, action) => {
      state.isLoading = false
      state.error = action.payload.error
       state.status = 'failed'
    },
    clearBusinessData: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const {
  businessOperationStart,
  businessOperationSuccess,
  businessOperationFail,
  clearBusinessData,
} = businessSlice.actions

export const createBusiness = (businessData) => {
  return async (dispatch, getState) => {
    dispatch(businessOperationStart())

    try {
      const token = getState().auth.token

      console.log('API CALL: Creating business with token:', token, businessData)
      await new Promise(res => setTimeout(res, 1000))
 
      const newBusinessDetails = { 
          id: 101,
          owner_id: 'uuid-123-abc',
          name: businessData.bussinessName,
          ...businessData 
      }

      dispatch(businessOperationSuccess({ businessDetails: newBusinessDetails }))

      dispatch(updateUserBusinessStatus(true))
      
    } catch (error) {
      dispatch(businessOperationFail({ error: error.message || 'Failed to create business' }))
    }
  }
}

export const fetchBusinessDetails = () => {
    return async (dispatch, getState) => {
        dispatch(businessOperationStart())
        try {
            const token = getState().auth.token

            console.log('API CALL: Fetching business details...')
            await new Promise(res => setTimeout(res, 500))
            
            const existingBusiness = { 
                id: 101,
                owner_id: 'uuid-123-abc',
                name: businessData.bussinessName,
                ...businessData 
            }

            dispatch(businessOperationSuccess({ businessDetails: existingBusiness }))

        } catch (error) {
            dispatch(businessOperationFail({ error: error.message || 'Failed to fetch business details' }))
        }
    }
}

export default businessSlice.reducer