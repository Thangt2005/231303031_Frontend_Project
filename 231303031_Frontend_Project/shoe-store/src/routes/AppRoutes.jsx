import BlogDetail from '../pages/Blog/BlogDetail';
import { Routes, Route } from 'react-router';
import Layout from '../layouts/Layout';
import ProtectedRoute from './ProtectedRoute';
import {
  Home,
  Products,
  ProductDetail,
  Cart,
  Blog,
  Login,
  NotFound,
  Checkout,
  Account,
  Orders,
} from '../pages';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="account" element={<Account />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
