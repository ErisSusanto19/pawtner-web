import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
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
    authStart: (state) => {
      state.isLoading = true
      state.error = null
      state.message = null
      state.status = 'loading'
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
      state.message = null
      state.error = null
    },

    authFail: (state, action) => {
      state.isLoading = false
      state.error = action.payload.error
      state.status = 'failed'
    },

    logoutSuccess: (state) => {
      Object.assign(state, { ...initialState, token: null, isAuthenticated: false, status: 'idle' })
    },

    updateUserBusinessStatus: (state, action) => {
        if(state.user) {
            state.user.hasBusiness = action.payload
        }
    }
  },
})

export const {
  authStart,
  registerSuccess,
  loginSuccess,
  authFail,
  logoutSuccess,
  updateUserBusinessStatus,
} = authSlice.actions

export const registerUser = (userData) => {
  return async (dispatch) => {
    dispatch(authStart())
    try {
      await new Promise(res => setTimeout(res, 1000))
      console.log('API CALL: Registering user...', userData)

      dispatch(registerSuccess({ message: 'Registration successful. Please check your email.' }))

    } catch (error) {
      dispatch(authFail({ error: error.message || 'Registration failed' }))
    }
  }
}

export const loginUser = (credentials) => {
  return async (dispatch) => {
    dispatch(authStart())
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
      dispatch(authFail({ error: error.message || 'Login failed' }))
    }
  }
}

export const logout = () => {
    return (dispatch) => {
        localStorage.removeItem('token')
        dispatch(logoutSuccess())
        // dispatch aksi untuk clear businessSlice di sini
    }
}

export default authSlice.reducer