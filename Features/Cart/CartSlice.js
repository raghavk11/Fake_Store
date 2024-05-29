import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config';

export const uploadCart = createAsyncThunk(
  'cart/uploadCart',
  async (cartItems, { rejectWithValue }) => {
    try {
      const items = cartItems.map((item) => ({
        id: item.id,
        price: item.price,
        count: item.quantity,
      }));

      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload cart');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    incrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find((i) => i.id === itemId);

      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find((i) => i.id === itemId);

      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter((i) => i.id !== itemId);
        } else {
          item.quantity -= 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadCart.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
      })
      .addCase(uploadCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addItem, removeItem, incrementQuantity, decrementQuantity } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemsCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export default cartSlice.reducer;
