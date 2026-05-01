import { createSlice } from "@reduxjs/toolkit";
import { loadAnalytics } from "./analyticsThunks";

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOAD
      .addCase(loadAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(loadAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default analyticsSlice.reducer;
