import { createBrowserRouter } from 'react-router-dom'
import RegisterPage from '../pages/petshop/auth/RegisterPage'
import LoginPage from '../pages/petshop/auth/LoginPage'
import DashboardPage from '../pages/petshop/dashboard/DashboardPage'

const router = createBrowserRouter([
    {
        path: '/',
        element: <DashboardPage/>
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