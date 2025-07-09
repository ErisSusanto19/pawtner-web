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

import AdminRootLayout from '../layouts/AdminRootLayout';
import AdminLayout from '../layouts/AdminLayout';
import AdminLoginPage from '../pages/admin/auth/LoginPage';
import AdminDashboardPage from '../pages/admin/dashboard/AdminDashboardPage';
import UserManagementPage from '../pages/admin/user-management/UserManagementPage';
import UserDetailPage from '../pages/admin/user-management/UserDetailPage';
import BusinessManagementPage from '../pages/admin/business-management/BusinessManagementPage';
import BusinessDetailPage from '../pages/admin/business-management/BusinessDetailPage';
import AdminSettingsPage from '../pages/admin/settings/AdminSettingsPage';
import ResetPasswordPage from '../pages/petshop/auth/ResetPasswordPage';
import OAuthCallbackPage from '../pages/petshop/auth/OauthCallbackPage';
import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
    {
        element: <RootLayout/>,
        children: [
            {
                element: <PetshopLayout/>,
                children: [
                    {
                        path: '/',
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
                path: 'verify-email',
                element: <VerifyEmailPage />,
            },
        ]
    },
    
    {
        path: 'reset-password',
        element: <ResetPasswordPage/>
    },

    {
        path: '/oauth-redirect',
        element: <OAuthCallbackPage />
    },
    
    {
        path: '/admin',
        element: <AdminRootLayout/>,
        children: [
            {
                element: <AdminLayout/>,
                children: [
                    {
                        path: '/admin/dashboard',
                        element: <AdminDashboardPage/>
                    },
                    {
                        path: '/admin/users',
                        element: <UserManagementPage/>
                    },
                    {
                        path: '/admin/users/:userId',
                        element: <UserDetailPage/>
                    },
                    {
                        path: '/admin/businesses',
                        element: <BusinessManagementPage/>
                    },
                    {
                        path: '/admin/businesses/:businessId',
                        element: <BusinessDetailPage/>
                    },
                    {
                        path: '/admin/settings',
                        element: <AdminSettingsPage/>
                    },
                ]
            },
        ]
    },

    {
        path: '/admin/login',
        element: <AdminLoginPage/>
    },

    {
        path: '*',
        element: <NotFoundPage/>
    }
  
])

export default router