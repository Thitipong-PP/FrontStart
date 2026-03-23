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

export const loadBookings = createAsyncThunk('bookings/load', async () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Booking[];
});

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (
    payload: { userId: string; userName: string; userEmail: string; dentistId: string; date: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { bookings: BookingState };
    if (state.bookings.items.some((b) => b.userId === payload.userId)) {
      return rejectWithValue('You already have an active booking');
    }
    const dentist = await fetchDentist(payload.dentistId);
    if (!dentist) {
      return rejectWithValue('Dentist not found');
    }
    const booking: Booking = {
      id: Date.now().toString(),
      ...payload,
      dentistName: dentist.name,
      createdAt: new Date().toISOString(),
    };
    const updated = [...state.bookings.items, booking];
    saveToStorage(updated);
    return booking;
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/update',
  async (
    payload: { bookingId: string; dentistId: string; date: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { bookings: BookingState };
    const idx = state.bookings.items.findIndex((b) => b.id === payload.bookingId);
    if (idx === -1) return rejectWithValue('Booking not found');

    const dentist = await fetchDentist(payload.dentistId);
    if (!dentist) {
      return rejectWithValue('Dentist not found');
    }
    const updated = state.bookings.items.map((b) =>
      b.id === payload.bookingId
        ? { ...b, dentistId: payload.dentistId, dentistName: dentist.name, date: payload.date }
        : b
    );
    saveToStorage(updated);
    return updated[idx];
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/delete',
  async (bookingId: string, { getState }) => {
    const state = getState() as { bookings: BookingState };
    const updated = state.bookings.items.filter((b) => b.id !== bookingId);
    saveToStorage(updated);
    return bookingId;
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
