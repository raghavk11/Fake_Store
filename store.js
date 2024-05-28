import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './OrdersSlice';
import cartReducer from './Features/Cart/CartSlice';
import authReducer from './Features/Auth/AuthSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});