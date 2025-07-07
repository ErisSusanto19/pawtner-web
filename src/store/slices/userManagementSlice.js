import { createSlice } from '@reduxjs/toolkit';
import * as userManagementApi from '../../api/userManagementApi'; 

const initialState = {
  items: [],
  selectedUser: null,
  pagination: {
    currentPage: 0,
    totalPages: 1,
    totalItems: 0,
    size: 10,
  },
  isLoading: false,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    operationStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.status = 'loading';
    },

    operationFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
      state.status = 'failed';
    },

    fetchAllUsersSuccess: (state, action) => {
      const usersData = action.payload.data;
      
      state.items = usersData;
      state.isLoading = false;
      state.status = 'succeeded';
    
      state.pagination.totalItems = usersData.length;
      state.pagination.currentPage = 0;
      state.pagination.totalPages = 1;
    },
    fetchUserByIdSuccess: (state, action) => {
      state.selectedUser = action.payload.data;
      state.isLoading = false;
      state.status = 'succeeded';
    },

    updateUserSuccess: (state, action) => {
      const updatedUser = action.payload;
      
      const index = state.items.findIndex(user => user.id === updatedUser.id);
      if (index !== -1) {
        state.items[index] = updatedUser;
      }

      if (state.selectedUser && state.selectedUser.id === updatedUser.id) {
        state.selectedUser = updatedUser;
      }

      state.isLoading = false;
      state.status = 'succeeded';
    },

    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
});

export const {
  operationStart,
  operationFail,
  fetchAllUsersSuccess,
  fetchUserByIdSuccess,
  updateUserSuccess,
  clearSelectedUser
} = userManagementSlice.actions;

export const fetchAllUsers = (params) => async (dispatch) => {
  dispatch(operationStart());
  try {
    const data = await userManagementApi.getAllUsers(params);
    console.log(data, 'cek response fecth all user');
    
    dispatch(fetchAllUsersSuccess(data));
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch users.';
    dispatch(operationFail({ error: errorMessage }));
    throw new Error(errorMessage);
  }
};

export const fetchUserById = (userId) => async (dispatch) => {
  dispatch(operationStart());
  try {
    const data = await userManagementApi.getUserById(userId);
    dispatch(fetchUserByIdSuccess(data));
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user details.';
    dispatch(operationFail({ error: errorMessage }));
    throw new Error(errorMessage);
  }
};

export const toggleUserStatusAction = (userId, action, value) => async (dispatch) => {
  dispatch(operationStart());
  try {
    const updatedUserData = await userManagementApi.toggleUserStatus(userId, action, value)
    console.log('User status updated successfully:', updatedUserData)
    dispatch(updateUserSuccess(updatedUserData.data))
    return updatedUserData
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update user status.'
    dispatch(operationFail({ error: errorMessage }))
    throw new Error(errorMessage)
  }
}

export default userManagementSlice.reducer