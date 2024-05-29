import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config';

// Define the async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Define the async thunk for updating order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/updateorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId, status }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to update order status: ${errorDetails.message}`);
      }

      const data = await response.json();
      return { orderId, status: data.status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addOrder: (state, action) => {
      const newOrder = { ...action.payload, status: 'new' };
      state.orders.push(newOrder);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const existingOrder = state.orders.find((order) => order.id === orderId);
        if (existingOrder) {
          existingOrder.status = status;
        }
      });
  },
});

export const { addOrder } = ordersSlice.actions;

export const selectOrders = (state) => state.orders.orders;

export default ordersSlice.reducer;
