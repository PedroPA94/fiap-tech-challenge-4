import { createSlice } from "@reduxjs/toolkit";
import {
  loadTransactions,
  addTransaction,
  updateTransaction,
} from "./transactionsThunks";

const initialState = {
  list: [],
  isLoading: false,
  isLoadingMore: false,
  cursor: null,
  hasMore: true,
  filters: {
    category: null,
    date: null,
  },
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;

      // reset paginação
      state.cursor = null;
      state.hasMore = true;
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // LOAD
      .addCase(loadTransactions.pending, (state, action) => {
        if (action.meta.arg?.loadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
          state.list = [];
          state.cursor = null;
          state.hasMore = true;
        }
        state.error = null;
      })
      .addCase(loadTransactions.fulfilled, (state, action) => {
        const { data, nextCursor, loadMore } = action.payload;

        state.isLoading = false;
        state.isLoadingMore = false;

        if (loadMore) {
          state.list = [...state.list, ...data];
        } else {
          state.list = data;
        }

        state.cursor = nextCursor;
        state.hasMore = data.length > 0;
      })
      .addCase(loadTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = [action.payload, ...state.list];
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isLoading = false;

        state.list = state.list.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        );
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default transactionsSlice.reducer;
export const { setFilters } = transactionsSlice.actions;
