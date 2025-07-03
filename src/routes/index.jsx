import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import PetshopLayout from '../layouts/PetshopLayout';

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
import PaymentPage from '../pages/petshop/payments/PaymentPage';
import PaymentDetailPage from '../pages/petshop/payments/PayementDetailPage';
import ServiceDetailPage from '../pages/petshop/petservice/ServiceDetailPage';
import RegisterAccountPage from '../pages/petshop/auth/RegisterAccountPage';
import RegisterBusinessPage from '../pages/petshop/auth/RegisterBusinessPage';
import VerifyEmailPage from '../pages/petshop/auth/VerifyEmailPage';

import AuthGuard from '../pages/petshop/guard/AuthGuard';
import BusinessSetupGuard from '../pages/petshop/guard/BusinessSetupGuard';
import VerifyEmailGuard from '../pages/petshop/guard/VerifyEmailGuard';

const router = createBrowserRouter([
    {
        element: <RootLayout/>,
        children: [
            {
                path: '/',
                element: (
                    <AuthGuard>
                        <PetshopLayout/>
                    </AuthGuard>
                ),
                children: [
                    {
                        element: <BusinessSetupGuard />,
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
                                path: 'services/:serviceId',
                                element: <ServiceDetailPage />,
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
                            {
                                path: 'payments',
                                element: <PaymentPage/>
                            },
                            {
                                path: 'payments/:paymentId',
                                element: <PaymentDetailPage/>
                            },
                            {
                                path: 'register-business',
                                element: <RegisterBusinessPage/>
                            },
                        ]
                    }
                    
                ],
            },

        ]
    },

      
    {
        path: 'signup',
        element: <RegisterAccountPage />,
    },
    {
        path: 'signin',
        element: <LoginPage />,
    },
    {
        element: <VerifyEmailGuard />,
        children: [
            {
                path: 'verify-email',
                element: <VerifyEmailPage />,
            },
        ],
    },
  
])

export default router