import { createBrowserRouter } from 'react-router-dom'
import RegisterPage from '../pages/petshop/auth/RegisterPage'
import LoginPage from '../pages/petshop/auth/LoginPage'

const router = createBrowserRouter([
    {
        path: '/',
        element: <div className='bg-sky-200'><h1 className='text-green-400'>Yooo</h1></div>
    },
    {
        path: '/signup',
        element: <RegisterPage/>
    },
    {
        path: '/signin',
        element: <LoginPage/>
    }
])

export default router