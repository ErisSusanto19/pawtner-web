import axios from 'axios';

let store

export const injectAdminStore = (_store) => {
  store = _store
}

const baseURL = import.meta.env.VITE_BASE_URL_API

const axiosAdminInstance = axios.create({
  baseURL
})

axiosAdminInstance.interceptors.request.use(
  (config) => {
    
    if (store) {
      const state = store.getState()
      console.log('Interceptor: Current Redux State', state)

      const token = state.adminAuth.adminToken

      if (token) {
        // console.log('Interceptor: Token found, attaching to headers.', token)
        config.headers['Authorization'] = `Bearer ${token}`
      } else {
        console.log('Interceptor: No token found in state.')
      }
    }

    config.headers['ngrok-skip-browser-warning'] = 'true'

    // console.log('AXIOS INTERCEPTOR: Final headers being sent:', config.headers)

    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosAdminInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized (401). Consider dispatching logout action.');
      if (store) {
        // import { logout } from '../features/auth/authSlice'; // Hati-hati circular dependency
        // store.dispatch(logout());
      }
    }
    return Promise.reject(error)
  }
)

export default axiosAdminInstance