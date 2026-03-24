import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDentist } from '../../data/dentists';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  dentistId: string;
  dentistName: string;
  date: string;
  createdAt: string;
}

interface BookingState {
  items: Booking[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: BookingState = {
  items: [],
  status: 'idle',
};

const STORAGE_KEY = 'bookings';

const saveToStorage = (bookings: Booking[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));

// ── Thunks ────────────────────────────────────────────────────────────────────

export const loadBookings = createAsyncThunk('bookings/load', async (token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.data.map((b: any) => ({
    id: b._id,
    userId: b.user,
    dentistId: b.dentist.id,
    date: b.bookingDate,
    ...b
  }));
});

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (
    payload: { dentistId: string; date: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${payload.token}`,
        },
        body: JSON.stringify({
          bookingDate: payload.date,
          dentist: payload.dentistId,
        }),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return data.data;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/update',
  async (
    payload: { bookingId: string; dentistId: string; date: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${payload.bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${payload.token}`,
        },
        body: JSON.stringify({
          bookingDate: payload.date,
          dentist: payload.dentistId,
        }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return {
        id: data.data._id,
        userId: data.data.user,
        dentistId: data.data.dentist,
        date: data.data.bookingDate,
        ...data.data
      };
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/delete',
  async (payload: { bookingId: string; token: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${payload.bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${payload.token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        return rejectWithValue(data.message);
      }
      return payload.bookingId;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBookings.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      });
  },
});

export default bookingSlice.reducer;

// Selectors
export const selectAllBookings = (state: { bookings: BookingState }) =>
  state.bookings.items;

export const selectUserBooking = (userId: string) =>
  (state: { bookings: BookingState }) =>
    state.bookings.items.find((b) => b.userId === userId) ?? null;
