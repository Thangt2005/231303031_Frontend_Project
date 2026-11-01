import { Routes, Route } from 'react-router';
import Layout from '../layouts/Layout';
import BlogDetail from '../pages/BlogDetail';
import {
  Home,
  Products,
  ProductDetail,
  Cart,
  Blog,
  Login,
  NotFound,
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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

