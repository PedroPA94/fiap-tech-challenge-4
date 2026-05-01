import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import transactionsReducer from "./transactions/transactionsSlice";
import summaryReducer from "./summary/summarySlice";
import analyticsReducer from "./analytics/analyticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    summary: summaryReducer,
    analytics: analyticsReducer,
  },
});
