import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './Features/Cart/CartSlice';
import authReducer from './Features/Auth/AuthSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});