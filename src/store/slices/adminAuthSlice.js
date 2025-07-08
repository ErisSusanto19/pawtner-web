import { createSlice } from '@reduxjs/toolkit';
import * as adminApi from '../../api/adminAuthApi'

const getInitialState = () => {
  try {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');

    return {
      admin: adminData ? JSON.parse(adminData) : null,
      adminToken: adminToken,
      isAdminAuthenticated: !!adminToken,
    };
  } catch (error) {
    console.error("Failed to parse admin data from localStorage", error)
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    return {
      admin: null,
      adminToken: null,
      isAdminAuthenticated: false,
    };
  }
};

const initialState = {
  ...getInitialState(),
  isLoading: false,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
}

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    adminOperationStart: (state) => {
      state.isLoading = true
      state.error = null
      state.status = 'loading'
    },

    adminOperationFail: (state, action) => {
      state.isLoading = false
      state.error = action.payload.error
      state.status = 'failed'
    },

    adminLoginSuccess: (state, action) => {
      state.isLoading = false
      state.isAdminAuthenticated = true
      state.admin = action.payload.admin
      state.token = action.payload.token
      state.error = null;
      state.status = 'succeeded'
    },

    adminLogoutSuccess: (state) => {
      Object.assign(state, {
        ...initialState,
        admin: null,
        token: null,
        isAdminAuthenticated: false,
      })
    },

    clearAdminError: (state) => {
      state.error = null;
    }
  },
})

export const {
  adminOperationStart,
  adminOperationFail,
  adminLoginSuccess,
  adminLogoutSuccess,
  clearAdminError
} = adminAuthSlice.actions

export const loginAdmin = (credentials) => async (dispatch) => {
  dispatch(adminOperationStart());
  try {
    const { data }= await adminApi.loginAdmin(credentials)
    
    // if (data?.admin?.role !== 'admin') {
    //   throw new Error('Access Denied. User does not have admin privileges.')
    // }

    localStorage.setItem('adminToken', data.token)
    localStorage.setItem('admin', JSON.stringify(data))

    dispatch(adminLoginSuccess({ admin: data, token: data.token }))
    
    return data

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Admin login failed.';
    dispatch(adminOperationFail({ error: errorMessage }));
    throw new Error(errorMessage)
  }
}

export const logoutAdmin = () => (dispatch) => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('admin')
  
  dispatch(adminLogoutSuccess())
}

export default adminAuthSlice.reducer