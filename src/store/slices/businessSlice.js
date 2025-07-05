import { createSlice } from '@reduxjs/toolkit';
import { updateUserBusinessStatus } from './authSlice';
import * as businessApi from '../../api/businessApi'
import { formatToBackendHours, formatToFrontendHours } from '../../utils/formatter'

const getInitialBusinessDetails = () => {
  try {
      const item = localStorage.getItem('businessDetails')
      return item ? JSON.parse(item) : null
  } catch (error) {
      console.error("Failed to parse businessDetails from localStorage", error)
      return null
  }
}

const initialState = {
  details: getInitialBusinessDetails(),
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
      localStorage.removeItem('businessDetails')
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
  return async (dispatch) => {
    dispatch(businessOperationStart())

    try {
      const dataToSend = { ...formData }

      if (dataToSend.operationHours) {
        dataToSend.operationHours = formatToBackendHours(dataToSend.operationHours)
      }

      delete dataToSend.termsAccepted
      delete dataToSend.privacyAccepted

      const businessImageFile = formData.businessImageUrl
      const certificateFile = formData.certificateImageUrl
      
      delete formData.businessImageUrl;
      delete formData.certificateImageUrl;

      dataToSend.latitude = dataToSend.latitude? parseFloat(dataToSend.latitude.toFixed(6)) : null
      dataToSend.longitude = dataToSend.longitude? parseFloat(dataToSend.longitude.toFixed(6)) : null

      const apiFormData = new FormData()

      apiFormData.append(
        'business', 
        new Blob([JSON.stringify(dataToSend)], { type: "application/json" })
      )

      if (businessImageFile) {
        apiFormData.append('businessImage', businessImageFile)
        console.log("Appending business image:", businessImageFile?.name)
      }

      if (certificateFile) {
        apiFormData.append('certificateImage', certificateFile)
        console.log("Appending certificate file:", certificateFile?.name)
      }

      const response = await businessApi.registerBusiness(apiFormData)

      const newBusinessDetails = response.data

      localStorage.setItem('businessDetails', JSON.stringify(newBusinessDetails))
      dispatch(businessOperationSuccess({ businessDetails: newBusinessDetails }))
      dispatch(updateUserBusinessStatus(true))
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.'
      dispatch(businessOperationFail({ error: errorMessage }))
    }
  }
}

export const fetchMyBusiness = () => {
  return async (dispatch) => {
    dispatch(businessOperationStart())
    try {
      const response = await businessApi.getMyBusiness()
      const businesses = response.data

      if (businesses && businesses.length > 0) {
        const myBusiness = businesses[0]

        if (myBusiness.operation_hours) {
          myBusiness.operationHours = formatToFrontendHours(myBusiness.operation_hours)
        }

        localStorage.setItem('businessDetails', JSON.stringify(myBusiness))
        dispatch(businessOperationSuccess({ businessDetails: myBusiness }))
        
      } else {
        localStorage.removeItem('businessDetails')
        dispatch(clearBusinessData())
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Gagal memuat data bisnis.'
      dispatch(businessOperationFail({ error: errorMessage }))
      localStorage.removeItem('businessDetails')
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