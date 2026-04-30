import { createSlice } from "@reduxjs/toolkit";
import { loadSummary } from "./summaryThunks";

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOAD
      .addCase(loadSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(loadSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default summarySlice.reducer;
