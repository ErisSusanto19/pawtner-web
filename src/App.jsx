import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { Provider } from 'react-redux'
import store from './store'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <Provider store={store}>
      <RouterProvider router={router}/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  )
}

export default App
