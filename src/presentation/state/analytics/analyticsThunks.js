import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser as getCurrentUserUC } from "../../../application/usecases/user";
import { firebaseAuthRepository } from "../../../infrastructure/repositories/firebaseAuthRepository";
import { getUserAnalytics as getUserAnalyticsUC } from "../../../application/usecases/analytics/getUserAnalytics";
import { firebaseAnalyticsRepository } from "../../../infrastructure/repositories/firebaseAnalyticsRepository";

export const loadAnalytics = createAsyncThunk(
  "analytics/load",
  async (_, { rejectWithValue }) => {
    try {
      const user = getCurrentUserUC(firebaseAuthRepository);

      const data = await getUserAnalyticsUC(
        firebaseAnalyticsRepository,
        user.uid,
      );

      return data.toJSON();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
