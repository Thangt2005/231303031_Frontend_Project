import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Product } from '../store/slice/ProductListSlice';
import { load } from '../store/slice/ProductListSlice';
import { getProducts } from '../services/productService';

export type ProductsStatus = 'loading' | 'success' | 'error';

export function useProducts() {
  const dispatch = useDispatch();
  const products = useSelector((state: { products: Product[] }) => state.products);
  const [status, setStatus] = useState<ProductsStatus>(
    products.length > 0 ? 'success' : 'loading'
  );
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    setStatus('loading');
    setError('');

    try {
      const data = (await getProducts()) as Product[];
      dispatch(load(data));
      setStatus('success');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không tải được danh sách sản phẩm.'
      );
      setStatus('error');
    }
  }, [dispatch]);

  useEffect(() => {
    if (products.length === 0) {
      loadProducts();
    }
  }, [products.length, loadProducts]);

  return { products, status, error, reload: loadProducts };
}
