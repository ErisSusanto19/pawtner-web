import { createSlice } from '@reduxjs/toolkit';
import * as adminApi from '../../api/adminAuthApi';

const getInitialState = () => {
  try {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminDetails');

    if (adminToken && adminData) {
      return {
        admin: JSON.parse(adminData),
        adminToken: adminToken,
        isAdminAuthenticated: true,
      };
    }

    throw new Error("Sesi admin tidak lengkap atau tidak ada.");

  } catch (error) {
    // console.error("Gagal menginisialisasi state admin dari localStorage:", error.message);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminDetails');
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
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    adminOperationStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.status = 'loading';
    },

    adminOperationFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
      state.status = 'failed';
    },

    adminLoginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAdminAuthenticated = true;
      state.admin = action.payload.adminDetails;
      state.adminToken = action.payload.adminToken;
      state.error = null;
      state.status = 'succeeded';
    },

    adminLogoutSuccess: (state) => {
      state.admin = null;
      state.adminToken = null;
      state.isAdminAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.status = 'idle';
    },

    clearAdminError: (state) => {
      state.error = null;
    },
  },
});

export const {
  adminOperationStart,
  adminOperationFail,
  adminLoginSuccess,
  adminLogoutSuccess,
  clearAdminError,
} = adminAuthSlice.actions;


export const loginAdmin = (credentials) => async (dispatch) => {
  dispatch(adminOperationStart());
  try {
    const fullResponse = await adminApi.loginAdmin(credentials);
    console.log(fullResponse, '<<< full response after login');
    
    
    const responseData = fullResponse.data;

    const { token, ...adminDetails } = responseData;

    if (!token) {
        throw new Error("There is no token in login response.");
    }

    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminDetails', JSON.stringify(adminDetails));

    dispatch(adminLoginSuccess({ adminDetails, adminToken: token }));

    return fullResponse;

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed.';
    dispatch(adminOperationFail({ error: errorMessage }));
    throw new Error(errorMessage);
  }
};

export const logoutAdmin = () => (dispatch) => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminDetails');
  
  dispatch(adminLogoutSuccess());
};

export default adminAuthSlice.reducer;