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