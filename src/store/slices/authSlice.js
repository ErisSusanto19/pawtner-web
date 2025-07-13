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
  isProfileUpdating: false,
  isPasswordChanging: false,
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
      state.isProfileUpdating = false;
      if (state.user) {
        state.user = { ...state.user, ...action.payload.user }
      }
      state.status = 'succeeded'
    },

    logoutSuccess: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      state.message = null
      state.status = 'idle'
      state.isProfileUpdating = false
      state.isPasswordChanging = false
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

    changePasswordStart: (state) => {
      state.isPasswordChanging = true;
      state.error = null;
      state.message = null;
    },

    changePasswordSuccess: (state) => {
      state.isPasswordChanging = false;
      state.message = "Password changed successfully!"
    },

    changePasswordFail: (state, action) => {
      state.isPasswordChanging = false;
      state.error = action.payload.error;
    },

    updateProfileStart: (state) => {
      state.isProfileUpdating = true;
      state.error = null;
    }
  },
})

export const {
  authOperationStart,
  authOperationFail,
  registerSuccess,
  loginSuccess,
  fetchProfileSuccess,
  updateUserProfileSuccess,
  logoutSuccess,
  updateUserBusinessStatus,
  verifyEmailSuccess, 
  setToken,

  changePasswordStart,
  changePasswordSuccess,
  changePasswordFail,
  updateProfileStart,
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
      return Promise.reject(new Error(errorMessage))
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
    // throw new Error(errorMessage)
    return Promise.reject(new Error(errorMessage))
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
    return Promise.reject(new Error(errorMessage))
  }
}

export const loginUser = (credentials) => {
  return async (dispatch, getState) => {
    dispatch(authOperationStart());
    try {
      const response = await authApi.login(credentials)
      console.log(response, '<<< cek response login');
      
      const { data } = response

      if (!data.token || !data.userId) {
        throw new Error("Login response from server is incomplete.")
      }

      localStorage.setItem('token', data.token)
      dispatch(setToken(data.token))

      const profileResponse = await authApi.getProfile(data.userId)
      const fullUserProfile = profileResponse.data

      if (!fullUserProfile || !fullUserProfile.id) {
          throw new Error("Failed to fetch user profile after login.")
      }

      localStorage.setItem('user', JSON.stringify(fullUserProfile))
      dispatch(loginSuccess({ user: fullUserProfile, token: data.token }))

      await dispatch(fetchMyBusiness())
      const finalBusinessState = getState().business
      if (finalBusinessState.details) {
        dispatch(updateUserBusinessStatus(true))
      } else {
        dispatch(updateUserBusinessStatus(false))
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login process failed.'
      dispatch(authOperationFail({ error: errorMessage }))
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return Promise.reject(new Error(errorMessage))
    }
  }
}

export const checkUserSession = () => async (dispatch, getState) => {
  const { token, user: userInState } = getState().auth

  if (!token) return

  const userId = userInState?.userId || userInState?.id
  if (!userId) {
      console.error("Session check failed: User ID not found in local state.");
      dispatch(logout()); 
      return;
  }
  
  dispatch(authOperationStart())
  try {
    const profileResponse = await authApi.getProfile(userId); 
    const fullUserProfile = profileResponse.data

    if (!fullUserProfile || !fullUserProfile.id) {
        throw new Error("Session invalid or expired. Could not fetch profile.");
    }

    localStorage.setItem('user', JSON.stringify(fullUserProfile))
    dispatch(loginSuccess({ user: fullUserProfile, token }))

    await dispatch(fetchMyBusiness())
    const finalBusinessState = getState().business
    if (finalBusinessState.details) {
      dispatch(updateUserBusinessStatus(true))
    } else {
      dispatch(updateUserBusinessStatus(false))
    }

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Session expired.'
    dispatch(authOperationFail({ error: errorMessage }))
    if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch(logout())
    }
    return Promise.reject(new Error(errorMessage))
  }
}

export const fetchUserProfile = () => async (dispatch, getState) => {
    const { user } = getState().auth;
    const userId = user?.userId || user?.id;

    if (!userId) {
        console.error("fetchUserProfile: Cannot fetch profile, userId is missing from state.");
        return;
    }

    dispatch(authOperationStart());
    try {
        const response = await authApi.getProfile(userId); 
        const fullUserProfile = response.data;

        if (!fullUserProfile || !fullUserProfile.id) {
            throw new Error("Failed to fetch user profile. The user data is incomplete.");
        }

        localStorage.setItem('user', JSON.stringify(fullUserProfile));
        dispatch(fetchProfileSuccess({ user: fullUserProfile }));

    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load profile data.';
        dispatch(authOperationFail({ error: errorMessage }))
        return Promise.reject(new Error(errorMessage))
    }
};

export const updateUserProfile = (formData) => {
  return async (dispatch, getState) => {
      dispatch(updateProfileStart())
      dispatch(authOperationStart())

      try {
          console.log("Updating user profile with form data:", formData)

          const userRequestData = {
            name: formData.name,
            phone: formData.phone || '',
            address: formData.address || ''
          }

          const apiData = new FormData()
        
          const userDtoBlob = new Blob([JSON.stringify(userRequestData)], {
            type: 'application/json'
          })
          apiData.append('user', userDtoBlob)

          const imageValue = formData.imageUrl

          if (imageValue) {
            apiData.append('profileImage', imageValue)
          }
          console.log(formData, '<<< cek payload update');

          const response = await authApi.updateProfile(apiData)
          const updatedUserFields = response.data
          console.log(updatedUserFields, '<<< cek response update user by id');
          

          if (!updatedUserFields) {
              throw new Error("Invalid response from server after update.")
          }

          const currentUser = getState().auth.user
          const newUserData = { ...currentUser, ...updatedUserFields }

          localStorage.setItem('user', JSON.stringify(newUserData))
          dispatch(updateUserProfileSuccess({ user: newUserData }))
          
          return { ...newUserData, message: response.message };

      } catch (error) {
          console.error("Failed to update user profile:", error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile.';
          dispatch(authOperationFail({ error: errorMessage }));
          dispatch({ type: 'auth/updateProfileFail' }); 
          // throw new Error(errorMessage);
          return Promise.reject(new Error(errorMessage))
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
          
          dispatch(registerSuccess({ 
              message: response.message || "If an account with that email exists, a password reset link has been sent." 
          }))
          return response.message
      } catch (error) {
          console.error("Failed to request password reset:", error)
          const errorMessage = error.response?.data?.message || error.message || 'Failed to request password reset.'
          dispatch(authOperationFail({ error: errorMessage }))
          // throw new Error(errorMessage)
          return Promise.reject(new Error(errorMessage))
      }
  }
}

export const resetPassword = (resetData) => {
  return async (dispatch) => {
    dispatch(authOperationStart())
    try {
      if (!resetData.token || !resetData.newPassword) {
          throw new Error("Reset token and new password are required.")
      }

      const response = await authApi.resetPassword({
        token: resetData.token,
        newPassword: resetData.newPassword
      })

      dispatch(registerSuccess({ 
        message: response.message || "Password has been reset successfully. Please log in." 
      }));
      return response.message
    } catch (error) {
      console.error("Failed to reset password:", error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reset password.'
      dispatch(authOperationFail({ error: errorMessage }))
      // throw new Error(errorMessage)
      return Promise.reject(new Error(errorMessage))
    }
  }
}

export const changeUserPassword = (passwordData) => {
    return async (dispatch) => {
        dispatch(changePasswordStart());
        try {
            console.log(passwordData, '<<< from komponen');
            
            const response = await authApi.changePassword(passwordData);

            console.log(response, '<<< cek response change password');
            
            dispatch(changePasswordSuccess({ message: response.message }));
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to change password.';
            dispatch(changePasswordFail({ error: errorMessage }));
            // throw new Error(errorMessage);
            return Promise.reject(new Error(errorMessage))
        }
    };
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('businessDetails')
  dispatch(logoutSuccess())
  dispatch(clearBusinessData())
}

export default authSlice.reducer