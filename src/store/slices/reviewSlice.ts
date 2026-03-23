import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Review {
  id: string;
  dentistId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

interface ReviewState {
  items: Review[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ReviewState = {
  items: [],
  status: 'idle',
};

const STORAGE_KEY = 'reviews';

const saveToStorage = (reviews: Review[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

// ── Thunks ────────────────────────────────────────────────────────────────────

export const loadReviews = createAsyncThunk('reviews/load', async () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Review[];
});

export const addReview = createAsyncThunk(
  'reviews/add',
  async (
    payload: { dentistId: string; userId: string; userName: string; rating: number; comment: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { reviews: ReviewState };
    const duplicate = state.reviews.items.find(
      (r) => r.userId === payload.userId && r.dentistId === payload.dentistId
    );
    if (duplicate) return rejectWithValue('Already reviewed this dentist');

    const review: Review = {
      id: Date.now().toString(),
      ...payload,
      createdAt: new Date().toISOString(),
    };
    const updated = [...state.reviews.items, review];
    saveToStorage(updated);
    return review;
  }
);

export const updateReview = createAsyncThunk(
  'reviews/update',
  async (
    payload: { reviewId: string; rating: number; comment: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { reviews: ReviewState };
    const idx = state.reviews.items.findIndex((r) => r.id === payload.reviewId);
    if (idx === -1) return rejectWithValue('Review not found');

    const updated = state.reviews.items.map((r) =>
      r.id === payload.reviewId
        ? { ...r, rating: payload.rating, comment: payload.comment, updatedAt: new Date().toISOString() }
        : r
    );
    saveToStorage(updated);
    return updated[idx];
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (reviewId: string, { getState }) => {
    const state = getState() as { reviews: ReviewState };
    const updated = state.reviews.items.filter((r) => r.id !== reviewId);
    saveToStorage(updated);
    return reviewId;
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadReviews.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;

// Selectors
export const selectAllReviews = (state: { reviews: ReviewState }) =>
  state.reviews.items;

export const selectReviewsByDentist = (dentistId: string) =>
  (state: { reviews: ReviewState }) =>
    state.reviews.items.filter((r) => r.dentistId === dentistId);

export const selectUserReviewForDentist = (userId: string, dentistId: string) =>
  (state: { reviews: ReviewState }) =>
    state.reviews.items.find(
      (r) => r.userId === userId && r.dentistId === dentistId
    );

export const selectAverageRating = (dentistId: string) =>
  (state: { reviews: ReviewState }) => {
    const reviews = state.reviews.items.filter((r) => r.dentistId === dentistId);
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };
