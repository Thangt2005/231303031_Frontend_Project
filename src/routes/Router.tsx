import { createBrowserRouter } from 'react-router';
import { Products, Cart, Blog, Login } from '../pages';
import { Home } from '../components/Home';
import { ProductDetail } from '../components/ProductDetails';
import { Layout } from '../components/Layout';
import { Error } from './Error';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'blog', element: <Blog /> },
      { path: 'login', element: <Login /> },
    ],
  },
]);

export default router;
