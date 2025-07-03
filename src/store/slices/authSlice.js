import { createSlice } from '@reduxjs/toolkit';
import { clearBusinessData } from './businessSlice';

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
} = authSlice.actions

export const registerUser = (userData) => {
  return async (dispatch) => {
    dispatch(authOperationStart())
    try {
      await new Promise(res => setTimeout(res, 1000))
      console.log('API CALL: Registering user...', userData)

      dispatch(registerSuccess({ message: 'Registration successful. Please check your email.' }))

    } catch (error) {
      dispatch(authOperationFail({ error: error.message || 'Registration failed' }))
    }
  }
}

export const loginUser = (credentials) => {
  return async (dispatch) => {
    dispatch(authOperationStart())
    try {
      await new Promise(res => setTimeout(res, 1000))
      console.log('API CALL: Logging in...', credentials)
      let data
      if (credentials.email === 'erissusanto997@gmail.com') {
        data = { 
            user: { 
                id: 'uuid-123-abc',
                name: 'Eris Susanto',
                email: 'erissusanto997@gmail.com',
                role: 'business_owner',
                hasBusiness: false
            }, 
            token: 'mock_jwt_token_no_business' 
         }
      } else {
        throw new Error('Invalid credentials')
      }

      localStorage.setItem('token', data.token)
      
      dispatch(loginSuccess({ user: data.user, token: data.token }))
      
    } catch (error) {
      dispatch(authOperationFail({ error: error.message || 'Login failed' }))
    }
  }
}

export const fetchUserProfile = () => {
  return async (dispatch, getState) => {
    dispatch(authOperationStart())
    
    const token = getState().auth.token

    if (!token) {
        return dispatch(authOperationFail({ error: 'No token found' }))
    }

    try {
      console.log('API CALL: Fetching user profile with token...', token)
      await new Promise(res => setTimeout(res, 500))

      let userProfile
      if (token === 'mock_jwt_token_no_business') {
        userProfile = {
          id: 'uuid-123-abc',
          name: 'Eris Susanto',
          email: 'erissusanto997@gmail.com',
          role: 'business_owner',
          hasBusiness: false // true
        }
      } else {
        throw new Error('Invalid or expired token')
      }

      dispatch(loginSuccess({ user: userProfile, token: token }))

    } catch (error) {
      dispatch(authOperationFail({ error: error.message || 'Failed to fetch user' }))
      dispatch(logout())
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