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

export const createBusiness = (formData) => {
  return async (dispatch, getState) => {
    dispatch(businessOperationStart());

    try {
      const dataForApi = {
        name: formData.businessName,
        description: formData.businessDescription,
        business_type: formData.businessType,
        business_email: formData.businessEmail,
        business_phone: formData.businessPhone,
        address: formData.businessAddress,
        latitude: formData.businessLatitude,
        longitude: formData.businessLongitude,
        has_emergency_services: formData.hasEmergencyServices,
        emergency_phone: formData.emergencyPhone,
        business_image_url: formData.businessImageUrl?.name,
        certificate_image_url: formData.certificateImageUrl?.name,

        operation_hours: Object.keys(formData.operationHours).map(day => {
            const dayData = formData.operationHours[day];
            return {
                day: day.charAt(0).toUpperCase() + day.slice(1),
                isOpen: dayData.isOpen,
                open: dayData.open,
                close: dayData.close
            }
        })
      }

      console.log("Simulating API call with snake_case data:", dataForApi)
      await new Promise(res => setTimeout(res, 1000))
      
      const newBusinessDetails = {
        id: 101,
        ownerId: 'uuid-123-abc',
        name: dataForApi.name,
        description: dataForApi.description,
        businessType: dataForApi.business_type,
        businessEmail: dataForApi.business_email,
        businessPhone: dataForApi.business_phone,
        businessImageUrl: dataForApi.business_image_url,
        certificateImageUrl: dataForApi.certificate_image_url,
        hasEmergencyServices: dataForApi.has_emergency_services,
        emergencyPhone: dataForApi.emergency_phone,
        address: dataForApi.address,
        latitude: dataForApi.latitude,
        longitude: dataForApi.longitude,

        operationHours: dataForApi.operation_hours,
      }
      
      console.log("Saving camelCase data to Redux state & localStorage:", newBusinessDetails)

      localStorage.setItem('businessDetails', JSON.stringify(newBusinessDetails))
      dispatch(businessOperationSuccess({ businessDetails: newBusinessDetails }))
      dispatch(updateUserBusinessStatus(true));
      
    } catch (error) {
      dispatch(businessOperationFail({ error: error.message }))
    }
  }
}

export const fetchBusinessDetails = () => {
    return async (dispatch) => {
        dispatch(businessOperationStart())
        try {
          await new Promise(res => setTimeout(res, 500))
          const savedDataString = localStorage.getItem('businessDetails')

          if (!savedDataString) {
              dispatch(businessOperationSuccess({ businessDetails: null }))
              return;
          }
          
          const existingBusiness = JSON.parse(savedDataString)
          dispatch(businessOperationSuccess({ businessDetails: existingBusiness }))

        } catch (error) {
          dispatch(businessOperationFail({ error: error.message }))
        }
    }
}

export const updateBusinessDetails = (formData) => {
  return async (dispatch, getState) => {
    dispatch(businessOperationStart())

    try {
      console.log("Updating business with (camelCase from form):", formData)

      const dataForApi = {
        name: formData.name,
        description: formData.description,
        business_type: formData.businessType,
        business_email: formData.businessEmail,
        business_phone: formData.businessPhone,
        address: formData.address,
        has_emergency_services: formData.hasEmergencyServices,
        emergency_phone: formData.emergencyPhone,

        business_image_url: typeof formData.businessImageUrl === 'string' 
            ? formData.businessImageUrl 
            : formData.businessImageUrl?.name,
        certificate_image_url: typeof formData.certificateImageUrl === 'string' 
            ? formData.certificateImageUrl 
            : formData.certificateImageUrl?.name,

        operation_hours: Object.keys(formData.operationHours).map(day => {
            const dayData = formData.operationHours[day] || {};
            return {
                day: day.charAt(0).toUpperCase() + day.slice(1),
                isOpen: dayData.isOpen || false,
                open: dayData.open || '00:00',
                close: dayData.close || '00:00',
            }
        }),
      }
      
      console.log("Simulating API PUT/PATCH with (snake_case data):", dataForApi)

      await new Promise(res => setTimeout(res, 1000))
      
      const currentBusinessState = getState().business.details
      const updatedBusinessDetails = {
        ...currentBusinessState,
        name: formData.name,
        description: formData.description,
        businessType: formData.businessType,
        businessEmail: formData.businessEmail,
        businessPhone: formData.businessPhone,
        hasEmergencyServices: formData.hasEmergencyServices,
        emergencyPhone: formData.emergencyPhone,
        address: formData.address,
        businessImageUrl: dataForApi.business_image_url,
        certificateImageUrl: dataForApi.certificate_image_url,
        operationHours: dataForApi.operation_hours,
      }

      console.log("Saving updated (camelCase) data to Redux & localStorage:", updatedBusinessDetails)

      localStorage.setItem('businessDetails', JSON.stringify(updatedBusinessDetails))
      dispatch(businessOperationSuccess({ businessDetails: updatedBusinessDetails }))
      
    } catch (error) {
      console.error("Failed to update business details:", error)
      dispatch(businessOperationFail({ error: error.message || 'Failed to update business' }))
    }
  }
}

export default businessSlice.reducer