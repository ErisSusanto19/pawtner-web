import { createSlice } from '@reduxjs/toolkit';
import { clearBusinessData } from './businessSlice';
import * as authApi from '../../api/authApi'
import { getBusinessById, getMyBusiness } from '../../api/businessApi'

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
            state.user.hasBusiness = action.payload;
        }
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
  return async (dispatch) => {
    dispatch(authOperationStart());
    try {
      const loginResponse = await authApi.login(credentials);
      const userId = loginResponse.data.userId
      const token = loginResponse.data.token

      if (!token || !userId) {
        throw new Error("Login response from server is incomplete.");
      }

      localStorage.setItem('token', token);
      dispatch(setToken(token));

      const userWithUndefinedBusiness = { ...loginResponse.data, hasBusiness: null };
      localStorage.setItem('user', JSON.stringify(userWithUndefinedBusiness));
      
      dispatch(loginSuccess({ user: userWithUndefinedBusiness, token: token }));

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login process failed.';
      dispatch(authOperationFail({ error: errorMessage }));
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error
    }
  }
}

export const checkUserBusinessStatus = (userId) => {
    return async (dispatch) => {
        try {
            const response = await getMyBusiness()
            console.log(response, '<<< cek my business')
            return true
        } catch (error) {
            if (error.response?.status === 404) {
                return false
            }
            throw error
        }
    }
}

export const fetchUserProfile = () => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        if (!token) return

        const userFromStorage = getState().auth.user
        if (!userFromStorage || !userFromStorage.id) {
            dispatch(logout())
            return
        }

        dispatch(authOperationStart())
        try {

            const userId = userFromStorage.id;
            
            const profileResponse = await authApi.getProfile(userId)
            const baseUser = profileResponse.data.user || profileResponse.data

            const hasBusiness = await dispatch(checkUserBusinessStatus(userId))

            const finalUserProfile = { ...baseUser, hasBusiness }

            localStorage.setItem('user', JSON.stringify(finalUserProfile))
            dispatch(loginSuccess({ user: finalUserProfile, token: token }))

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Session expired or invalid.'
            dispatch(authOperationFail({ error: errorMessage }))
            if (error.response?.status === 401) {
                dispatch(logout())
            }
        }
    }
}

export const updateUserProfile = (formData) => {
    return async (dispatch, getState) => {
        dispatch(authOperationStart())

        try {
            console.log("Updating user profile with form data:", formData)

            const dataForApi = {
                name: formData.name,
                phone_number: formData.phone_number,
            }
            console.log("Simulating API call with data:", dataForApi)
            await new Promise(res => setTimeout(res, 1000))
            
            const updatedUser = {
                name: formData.name,
                phone_number: formData.phone_number,
            }

            const savedUserString = localStorage.getItem('user')
            if (savedUserString) {
                const savedUser = JSON.parse(savedUserString)
                const newSavedUser = { ...savedUser, ...updatedUser }
                localStorage.setItem('user', JSON.stringify(newSavedUser))
            }
            
            dispatch(updateUserProfileSuccess({ user: updatedUser }))
            
        } catch (error) {
            console.error("Failed to update user profile:", error)
            dispatch(authOperationFail({ error: error.message || 'Failed to update profile' }))
        }
    }
}

export const changeUserPassword = (formData) => {
    return async (dispatch) => {
        dispatch(authOperationStart())

        if (formData.newPassword !== formData.confirmPassword) {
            const error = { message: "New passwords do not match." }
            dispatch(authOperationFail({ error: error.message }))
            throw error
        }

        try {
            const dataForApi = {
                current_password: formData.currentPassword,
                new_password: formData.newPassword
            }

            console.log("Simulating API call to change password with data:", dataForApi);
            await new Promise(res => setTimeout(res, 1000))
            dispatch(updateUserProfileSuccess({ user: {} }))
            
        } catch (error) {
            console.error("Failed to change password:", error)
            dispatch(authOperationFail({ error: error.message || 'Failed to change password' }))
            throw error
        }
    }
}

export const logout = () => {
    return (dispatch) => {
        localStorage.removeItem('token')
        dispatch(logoutSuccess())
        dispatch(clearBusinessData())
    }
}

export default authSlice.reducer