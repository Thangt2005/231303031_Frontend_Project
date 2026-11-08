import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from "react-redux";
import { store } from "./store/store";
import { CartProvider } from './context/CartContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <CartProvider>
                <App/>
            </CartProvider>
        </Provider>
    </StrictMode>,
)
