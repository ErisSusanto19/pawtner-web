import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://c485-180-248-33-245.ngrok-free.app/api',
})

export const setupInterceptors = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const state = store.getState()

      console.log(state, '<<< cek state')
      
      const token = state.adminAuth.token || state.auth.token

      if (token) {
        console.log(token, 'cek token');
        
        config.headers['Authorization'] = `Bearer ${token}`

      }
      
      config.headers['ngrok-skip-browser-warning'] = 'true'
      return config;
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized, consider dispatching logout action')
      }
      return Promise.reject(error)
    }
  )
}

export default axiosInstance