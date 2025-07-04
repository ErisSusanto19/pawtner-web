import { createSlice } from '@reduxjs/toolkit';
import { updateUserBusinessStatus } from './authSlice';
import * as businessApi from '../../api/businessApi'
import { formatToBackendHours, formatToFrontendHours } from '../../utils/formatter'

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
  console.log(formData, '<<< cek form data');
  
  return async (dispatch, getState) => {
    dispatch(businessOperationStart())

    try {
      const dataToSend = { ...formData }
      console.log(dataToSend, '<<< cek dataToSend');
      

      if (dataToSend.operationHours) {
        dataToSend.operationHours = formatToBackendHours(dataToSend.operationHours)
      }

      delete dataToSend.termsAccepted
      delete dataToSend.privacyAccepted

      const businessImageFile = formData.businessImageUrl
      const certificateFile = formData.certificateImageUrl
      
      // Hapus properti file dari objek JSON agar tidak terkirim dua kali
      delete formData.businessImageUrl;
      delete formData.certificateImageUrl;

      dataToSend.latitude = String(dataToSend.latitude)
      dataToSend.longitude = String(dataToSend.longitude)

      console.log("Data being sent to API after transformation:", dataToSend)

      const apiFormData = new FormData()

      apiFormData.append(
        'business', 
        new Blob([JSON.stringify(dataToSend)], { type: "application/json" })
      )

      if (businessImageFile) {
        apiFormData.append('businessImageFile', businessImageFile)
        console.log("Appending business image:", businessImageFile?.name)
      }

      if (certificateFile) {
        apiFormData.append('certificateFile', certificateFile)
        console.log("Appending certificate file:", certificateFile?.name)
      }

      const token = localStorage.getItem('token')

      const response = await businessApi.registerBusiness(apiFormData, token)

      const newBusinessDetails = response.data

      console.log(response, '<< cek response create bisnis')
      
      console.log("Saving data from response to Redux state:", newBusinessDetails)

      localStorage.setItem('businessDetails', JSON.stringify(newBusinessDetails))
      dispatch(businessOperationSuccess({ businessDetails: newBusinessDetails }))
      dispatch(updateUserBusinessStatus(true))
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      dispatch(businessOperationFail({ error: errorMessage }))
    }
  }
}

export const fetchBusinessDetails = (id) => {
    return async (dispatch) => {
        dispatch(businessOperationStart())
        try {
            const response = await businessApi.getBusinessById(id)

            if (response.data.operationHours) {
              response.data.operationHours = formatToFrontendHours(
                response.data.operationHours
              )
            }
            
            localStorage.setItem('businessDetails', JSON.stringify(response.data))
            
            dispatch(businessOperationSuccess({ businessDetails: response.data }))

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch business details.';
            
            if (error.response && error.response.status === 404) {
                localStorage.removeItem('businessDetails');
                dispatch(businessOperationSuccess({ businessDetails: null }))
            } else {
                dispatch(businessOperationFail({ error: errorMessage }))
            }
        }
    };
};

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