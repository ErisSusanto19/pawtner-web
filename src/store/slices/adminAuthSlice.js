import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  admin: JSON.parse(localStorage.getItem('admin')) || null,
  token: localStorage.getItem('adminToken') || null,
  isAdminAuthenticated: !!localStorage.getItem('adminToken'),
  isLoading: false,
  error: null,
}

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    authOperationStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    authOperationFail: (state, action) => {
      state.isLoading = false
      state.error = action.payload.error
    },
    loginAdminSuccess: (state, action) => {
      state.isLoading = false
      state.isAdminAuthenticated = true
      state.admin = action.payload.admin
      state.token = action.payload.token
      state.error = null
    },
    logoutAdminSuccess: (state) => {
      state.admin = null
      state.token = null
      state.isAdminAuthenticated = false
      state.isLoading = false
      state.error = null
    },
  },
})

export const {
  authOperationStart,
  authOperationFail,
  loginAdminSuccess,
  logoutAdminSuccess,
} = adminAuthSlice.actions

export const loginAdmin = (credentials) => {
  return async (dispatch) => {
    dispatch(authOperationStart())
    try {
      console.log('API CALL: Logging in as admin...', credentials)
      await new Promise(res => setTimeout(res, 1000))
      
      let data
      if (credentials.email === 'admin@pawtner.com' && credentials.password === '123456') {
        data = {
          admin: {
            id: 'uuid-admin-001',
            name: 'Super Admin',
            email: 'admin@pawtner.com',
            role: 'admin',
          },
          token: 'mock_jwt_token_for_admin_only',
        }
      } else {
        throw new Error('Invalid admin credentials')
      }

      if (data.admin.role !== 'admin') {
        throw new Error('Access Denied. Not an admin user.')
      }

      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('admin', JSON.stringify(data.admin))

      dispatch(loginAdminSuccess({ admin: data.admin, token: data.token }))

    } catch (error) {
      dispatch(authOperationFail({ error: error.message || 'Admin login failed' }))
    }
  }
}

export const logoutAdmin = () => {
  return (dispatch) => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    dispatch(logoutAdminSuccess())
  }
}

export default adminAuthSlice.reducer