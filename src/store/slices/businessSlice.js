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
      state.isLoading = false
      state.details = action.payload.businessDetails
      state.status = 'succeeded'
      localStorage.setItem('businessDetails', JSON.stringify(action.payload.businessDetails))
    },
    businessOperationFail: (state, action) => {
      state.isLoading = false
      state.error = action.payload.error
      state.status = 'failed'
    },
    clearBusinessData: (state) => {
      localStorage.removeItem('businessDetails')
      state.details = null
      state.isLoading = false
      state.error = null
      state.status = 'idle'
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
      console.log(response, '<<< cek response create business');
      
      const newBusinessDetails = response.data

      if (newBusinessDetails) {
        if (newBusinessDetails.operationHours) {
          newBusinessDetails.operationHours = formatToFrontendHours(newBusinessDetails.operationHours)
        }

        localStorage.setItem('businessDetails', JSON.stringify(newBusinessDetails))
        dispatch(businessOperationSuccess({ businessDetails: newBusinessDetails }))

        dispatch(updateUserBusinessStatus(true))
      } else {
        throw new Error("Business created, but no data was returned from the server.")
      }
      
    } catch (error) {
      let errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.'
      if(errorMessage.includes("similar record")){
        errorMessage = "Business email is already in use. Please use a different one."
      }
      dispatch(businessOperationFail({ error: errorMessage }))
      return Promise.reject(new Error(errorMessage))
    }
  }
}

export const fetchMyBusiness = () => {
  return async (dispatch) => {
    dispatch(businessOperationStart())
    try {
      const response = await businessApi.getMyBusiness()
      const businesses = response.data
      console.log(businesses, 'cek hasil api business');
      

      if (businesses && businesses.length > 0) {
        const myBusiness = businesses[0]
        console.log(myBusiness, '<<< cek my business');
        
        if (myBusiness.operationHours) {
          myBusiness.operationHours = formatToFrontendHours(myBusiness.operationHours)
        }

        localStorage.setItem('businessDetails', JSON.stringify(myBusiness))
        dispatch(businessOperationSuccess({ businessDetails: myBusiness }))
        dispatch(updateUserBusinessStatus(true))
        
      } else {
        localStorage.removeItem('businessDetails')
        dispatch(clearBusinessData())
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Gagal memuat data bisnis.'
      dispatch(businessOperationFail({ error: errorMessage }))
      localStorage.removeItem('businessDetails')
      return Promise.reject(new Error(errorMessage))
    }
  }
}

export const fetchBusinessById = (businessId) => async (dispatch) => {
  if (!businessId) {
      console.error("fetchBusinessById dipanggil tanpa businessId.");
      return;
  }

  dispatch(businessOperationStart())
  try {
    const response = await businessApi.getBusinessById(businessId)
    const fullBusinessDetails = response.data
    console.log(fullBusinessDetails, '<<< cek business by id');
    

    if (fullBusinessDetails.operationHours) {
        fullBusinessDetails.operationHours = fullBusinessDetails.operationHours
    }

    dispatch(businessOperationSuccess({ businessDetails: fullBusinessDetails }))
    
    return fullBusinessDetails

  } catch (error) {
    console.error("Failed to fetch business by ID:", error)
    const errorMessage = error.response?.data?.message || error.message || 'Gagal mengambil detail bisnis.'
    dispatch(businessOperationFail({ error: errorMessage }))
    return Promise.reject(new Error(errorMessage))
  }
}

export const updateBusinessDetails = (formData) => {
  return async (dispatch, getState) => {
    dispatch(businessOperationStart());
    console.log(formData, '<<< cek data dari form profile bisnis');

    const businessId = getState().business.details?.businessId
    if (!businessId) {
        const errorMsg = "Business ID not found. Cannot update."
        dispatch(businessOperationFail({ error: errorMsg }))
        throw new Error(errorMsg)
    }

    try {
      console.log("Updating business with form data:", formData);

      const dataToSend = { ...formData }

      const businessImageFile = dataToSend.businessImageUrl
      const certificateFile = dataToSend.certificateImageUrl

      dataToSend.operationHours = formatToBackendHours(dataToSend.operationHours)
      
      delete dataToSend.businessImageUrl
      delete dataToSend.certificateImageUrl
      delete dataToSend.id

      const apiPayload = new FormData()

      apiPayload.append(
        'business',
        new Blob([JSON.stringify(dataToSend)], { type: "application/json" })
      )

      if (businessImageFile && businessImageFile[0] instanceof File) {
        apiPayload.append('businessImage', businessImageFile[0])
      }

      if (certificateFile && certificateFile[0] instanceof File) {
        apiPayload.append('certificateImage', certificateFile[0])
      }

      if (businessImageFile) {
        apiPayload.append('businessImage', businessImageFile)
      }

      if (certificateFile) {
        apiPayload.append('certificateImage', certificateFile)
      }

      console.log(dataToSend, '<<< cek payload after convertion')

      const response = await businessApi.updateBusiness(businessId, apiPayload)
      console.log(response, '<<< cek response udapte business by id');
      

      const updatedBusinessFromApi = response.data

      if (!updatedBusinessFromApi) {
          throw new Error("Invalid response from server after update.");
      }

      const currentBusinessState = getState().business.details;
      const newBusinessDetails = { ...currentBusinessState, ...updatedBusinessFromApi };

      console.log("Saving updated data from API directly to Redux & localStorage:", newBusinessDetails)
      localStorage.setItem('businessDetails', JSON.stringify(newBusinessDetails))
      dispatch(businessOperationSuccess({ businessDetails: newBusinessDetails }))
      
      return newBusinessDetails

    } catch (error) {
      console.error("Failed to update business details:", error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update business'
      dispatch(businessOperationFail({ error: errorMessage }))
      // throw error
      return Promise.reject(new Error(errorMessage))
    }
  }
}

export default businessSlice.reducer