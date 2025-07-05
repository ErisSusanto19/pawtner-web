import { createSlice } from '@reduxjs/toolkit';
import { businessOperationStart, businessOperationSuccess, businessOperationFail, clearBusinessData } from './businessSlice';
import * as authApi from '../../api/authApi'
import { fetchMyBusiness } from './businessSlice'
import { formatToFrontendHours } from '../../utils/formatter'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  message: null,
  status: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authOperationStart: (state) => {
      state.isLoading = true
      state.error = null
      state.message = null
      state.status = 'loading'
    },

    authOperationFail: (state, action) => {
      state.isLoading = false
      state.error = action.payload.error
      state.status = 'failed'
    },

    registerSuccess: (state, action) => {
      state.isLoading = false
      state.message = action.payload.message
      state.status = 'registered'
    },

    loginSuccess: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.status = 'succeeded'
      state.error = null
    },

    setToken: (state, action) => {
        state.token = action.payload
    },

    fetchProfileSuccess: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.status = 'succeeded'
    },

    updateUserProfileSuccess: (state, action) => {
      state.isLoading = false
      if (state.user) {
        state.user = { ...state.user, ...action.payload.user }
      }
      state.status = 'succeeded'
    },
    
    changePasswordSuccess: (state) => {
      state.isLoading = false
      state.status = 'succeeded'
      state.message = "Password changed successfully!"
    },

    logoutSuccess: (state) => {
      Object.assign(state, { ...initialState, user: null, token: null, isAuthenticated: false })
    },

    updateUserBusinessStatus: (state, action) => {
        if(state.user) {
          state.user.hasBusiness = action.payload
          localStorage.setItem('user', JSON.stringify(state.user))
        }

        state.isLoading = false
    },

    verifyEmailSuccess: (state, action) => {
      state.isLoading = false
      state.message = action.payload.message
      state.status = 'verified'
      state.error = null
    },
  },
})

export const {
  authOperationStart,
  authOperationFail,
  registerSuccess,
  loginSuccess,
  fetchProfileSuccess,
  updateUserProfileSuccess,
  changePasswordSuccess,
  logoutSuccess,
  updateUserBusinessStatus,
  verifyEmailSuccess, 
  setToken
} = authSlice.actions

export const registerUser = (userData) => {
  return async (dispatch) => {
    dispatch(authOperationStart())
    try {
      const data = await authApi.register(userData)
      console.log('API CALL: Registering user...', userData)
      console.log(data, 'cek response from BE')

      dispatch(registerSuccess({ message: data.message || 'Registration successful. Please check your email.' }))

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed.'
      dispatch(authOperationFail({error: errorMessage}))
    }
  }
}

export const verifyUserEmail = (verificationData) => async (dispatch) => {
  dispatch(authOperationStart())
  try {
    const data = await authApi.verifyEmail(verificationData)
    console.log(data, 'cek response vrifikasi from BE')
    
    dispatch(verifyEmailSuccess({ message: data.message || 'Email verified successfully!' }))
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Verification failed'
    dispatch(authOperationFail({ error: errorMessage }))
    throw new Error(errorMessage)
  }
}

export const resendVerificationLink = (email) => async (dispatch) => {
  dispatch(authOperationStart())
  try {
    const data = await authApi.resendVerificationEmail({ email })
    console.log(data, 'cek response resend verifikasi from BE')
    dispatch(registerSuccess({ message: data.message || 'Verification link sent.' }))
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to resend link.'
    dispatch(authOperationFail({ error: errorMessage }))
  }
}

export const loginUser = (credentials) => {
  return async (dispatch, getState) => {
    dispatch(authOperationStart());
    try {
      const { data } = await authApi.login(credentials)

      if (!data.token || !data.userId) {
        throw new Error("Login response from server is incomplete.")
      }

      const userProfile = { 
        id: data.id, 
        name: data.name, 
        email: data.email, 
        hasBusiness: null 
      }

      localStorage.setItem('token', data.token)
      dispatch(setToken(data.token))
      localStorage.setItem('user', JSON.stringify(userProfile))
      
      dispatch(loginSuccess({ user: userProfile, token: data.token }))

      await dispatch(fetchMyBusiness())
      const finalBusinessState = getState().business
      if (finalBusinessState.details) {
        dispatch(updateUserBusinessStatus(true))
      } else {
        dispatch(updateUserBusinessStatus(false))
      }

      // dispatch(businessOperationStart())
      // try {
      //   const businessResponse = await getMyBusiness()
      //   console.log(businessResponse, '<<< cek bisnis after login')

      //   const businesses = businessResponse.data
  
      //   if (businesses && businesses.length > 0) {
      //     const myBusiness = businesses[0]
      //     if (myBusiness.operation_hours) {
      //       myBusiness.operationHours = formatToFrontendHours(myBusiness.operation_hours)
      //     }
  
      //     localStorage.setItem('businessDetails', JSON.stringify(myBusiness))
      //     dispatch(businessOperationSuccess({ businessDetails: myBusiness }))
          
      //     dispatch(updateUserBusinessStatus(true))

      //   } else {

      //     localStorage.removeItem('businessDetails')
      //     dispatch(clearBusinessData())

      //     dispatch(updateUserBusinessStatus(false))
      //   }
      // } catch (businessError) {
      //   console.error("Failed to fetch user's business:", businessError)
      //   dispatch(businessOperationFail({ error: "You dont have any business" }))
      //   dispatch(updateUserBusinessStatus(false))
      // }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login process failed.'
      dispatch(authOperationFail({ error: errorMessage }))
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      throw error
    }
  }
}

export const checkUserSession = () => async (dispatch, getState) => {
  const { token, user: userInState } = getState().auth

  if (!token) return

  if (userInState && typeof userInState.hasBusiness === 'boolean') {
    return
  }
  
  dispatch(authOperationStart())
  try {
    const profileResponse = await authApi.getProfile() 
    const userProfile = profileResponse.data

    if (!userProfile || !userProfile.id) {
        throw new Error("Session invalid or expired.")
    }
    
    const baseUser = { ...userProfile, hasBusiness: null }
    localStorage.setItem('user', JSON.stringify(baseUser))
    dispatch(loginSuccess({ user: baseUser, token }))

    await dispatch(fetchMyBusiness())
    const finalBusinessState = getState().business
    if (finalBusinessState.details) {
      dispatch(updateUserBusinessStatus(true))
    } else {
      dispatch(updateUserBusinessStatus(false))
    }

    // dispatch(businessOperationStart())
    // try {
    //   const businessResponse = await getMyBusiness()
    //   const businesses = businessResponse.data

    //   if (businesses && businesses.length > 0) {
    //     const myBusiness = businesses[0]
    //     localStorage.setItem('businessDetails', JSON.stringify(myBusiness))
    //     dispatch(businessOperationSuccess({ businessDetails: myBusiness }))
    //     dispatch(updateUserBusinessStatus(true))
    //   } else {
    //     localStorage.removeItem('businessDetails')
    //     dispatch(clearBusinessData())
    //     dispatch(updateUserBusinessStatus(false))
    //   }
    // } catch (businessError) {
    //   console.error("Failed to fetch user's business during session check:", businessError)
    //   dispatch(businessOperationFail({ error: "Gagal memverifikasi status bisnis." }))
    //   dispatch(updateUserBusinessStatus(false))
    // }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Session expired.'
    dispatch(authOperationFail({ error: errorMessage }))
    if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch(logout())
    }
  }
}

// export const fetchUserProfile = () => { // masih salah, belum ada api dari BE
//     return async (dispatch, getState) => {
//         const token = getState().auth.token
//         if (!token) return

//         const userFromStorage = getState().auth.user
//         if (!userFromStorage || !userFromStorage.id) {
//             dispatch(logout())
//             return
//         }

//         dispatch(authOperationStart())
//         try {

//             const userId = userFromStorage.id;
            
//             const profileResponse = await authApi.getProfile(userId)
//             const baseUser = profileResponse.data.user || profileResponse.data

//             const finalUserProfile = { ...baseUser, hasBusiness }

//             localStorage.setItem('user', JSON.stringify(finalUserProfile))
//             dispatch(loginSuccess({ user: finalUserProfile, token: token }))

//         } catch (error) {
//             const errorMessage = error.response?.data?.message || error.message || 'Session expired or invalid.'
//             dispatch(authOperationFail({ error: errorMessage }))
//             if (error.response?.status === 401) {
//                 dispatch(logout())
//             }
//         }
//     }
// }

export const updateUserProfile = (formData) => {
  return async (dispatch, getState) => {
      // 1. Beri sinyal bahwa operasi dimulai
      dispatch(authOperationStart());

      try {
          console.log("Updating user profile with form data:", formData)

          const dataForApi = {
            name: formData.name,
            phone: formData.phone,
            adress: formData.address
          }

        const response = await authApi.updateProfile(dataForApi);
        const updatedUserFields = response.data

        if (!updatedUserFields) {
            throw new Error("Invalid response from server after update.")
        }

        const currentUser = getState().auth.user
        const newUserData = { ...currentUser, ...updatedUserFields }

        localStorage.setItem('user', JSON.stringify(newUserData))

        dispatch(updateUserProfileSuccess({ user: newUserData }))

        return newUserData

      } catch (error) {
        console.error("Failed to update user profile:", error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile.'
        
        dispatch(authOperationFail({ error: errorMessage }))
        throw new Error(errorMessage)
      }
  }
}

export const requestPasswordReset = (email) => {
  return async (dispatch) => {
      dispatch(authOperationStart())

      try {
          if (!email) {
              throw new Error("Email address is required.")
          }

          const response = await authApi.requestPasswordReset({ email })
          
          dispatch(registerSuccess({ message: response.message || "If an account with that email exists, a password reset link has been sent." }))

          return response.message

      } catch (error) {
          console.error("Failed to request password reset:", error)
          const errorMessage = error.response?.data?.message || error.message || 'Failed to request password reset.';
          
          dispatch(authOperationFail({ error: errorMessage }))
          throw new Error(errorMessage)
      }
  }
}

export const resetPassword = (resetData) => {
  return async (dispatch) => {
    dispatch(authOperationStart())

    try {
      if (!resetData.email || !resetData.resetToken || !resetData.newPassword) {
          throw new Error("Email, reset token, and new password are required.")
      }

      const response = await authApi.resetPassword(resetData)

      dispatch(registerSuccess({ message: response.message || "Password has been reset successfully. Please log in." }))

      return response.message

    } catch (error) {
      console.error("Failed to reset password:", error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reset password.'

      dispatch(authOperationFail({ error: errorMessage }))

      throw new Error(errorMessage)
    }
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('businessDetails')
  dispatch(logoutSuccess())
  dispatch(clearBusinessData())
}

export default authSlice.reducer