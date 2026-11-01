import { createContext, useState } from 'react';

export const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [selectedProducts, setSelectedProducts] = useState([]);

  function addProduct(product) {
    if (!product || product.id == null) return;
    setSelectedProducts((products) => {
      if (products.length >= 3 || products.some((item) => item.id === product.id)) return products;
      return [...products, product];
    });
  }

  function removeProduct(id) {
    setSelectedProducts((products) => products.filter((product) => product.id !== id));
  }

  return <CompareContext.Provider value={{ selectedProducts, addProduct, removeProduct }}>{children}</CompareContext.Provider>;
}
