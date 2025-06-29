import { createBrowserRouter } from 'react-router-dom';
// import RootLayout from '../layouts/RootLayout';
import PetshopLayout from '../layouts/PetshopLayout';
import RegisterPage from '../pages/petshop/auth/RegisterPage';
import LoginPage from '../pages/petshop/auth/LoginPage';
import DashboardPage from '../pages/petshop/dashboard/DashboardPage';
import ProductsPage from '../pages/petshop/products/ProductPage';
import ProductDetailPage from '../pages/petshop/products/ProductDetailPage';
import OrderPage from '../pages/petshop/orders/OrderPage';
import OrderDetailPage from '../pages/petshop/orders/OrderDetailPage';
import ServicePage from '../pages/petshop/petservice/ServicePage';
import BookingPage from '../pages/petshop/booking/BookingPage';
import SettingPage from '../pages/petshop/shopsettings/SettingPage';
import BookingDetailPage from '../pages/petshop/booking/BookingDetailPage';

const router = createBrowserRouter([

    {
        path: '/',
        element: <PetshopLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: 'products',
                element: <ProductsPage />,
            },
            {
                path: 'products/:productId',
                element: <ProductDetailPage />,
            },
            {
                path: 'orders',
                element: <OrderPage />,
            },
            {
                path: 'orders/:orderId',
                element: <OrderDetailPage />,
            },
            {
                path: 'services',
                element: <ServicePage />,
            },
            {
                path: 'bookings',
                element: <BookingPage />,
            },
            {
                path: 'bookings/:bookingId',
                element: <BookingDetailPage />,
            },
            {
                path: 'settings',
                element: <SettingPage />,
            },
            
        ],
    },
      
    {
        path: 'signup',
        element: <RegisterPage />,
    },
    {
        path: 'signin',
        element: <LoginPage />,
    },
  
])

export default router