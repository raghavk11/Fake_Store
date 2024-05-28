import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    newOrdersCount: 0,
    orders: [],
  },
  reducers: {
    setNewOrdersCount: (state, action) => {
      state.newOrdersCount = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    // Add other necessary reducers
  },
});

export const { setNewOrdersCount, addOrder } = ordersSlice.actions;

export default ordersSlice.reducer;