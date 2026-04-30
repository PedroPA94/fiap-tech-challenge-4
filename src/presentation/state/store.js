import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import transactionsReducer from "./transactions/transactionsSlice";
import summaryReducer from "./summary/summarySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    summary: summaryReducer,
  },
});
