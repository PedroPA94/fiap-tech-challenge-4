import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser as getCurrentUserUC } from "../../../application/usecases/user";
import { firebaseAuthRepository } from "../../../infrastructure/repositories/firebaseAuthRepository";
import { getUserAnalytics as getUserAnalyticsUC } from "../../../application/usecases/analytics/getUserAnalytics";
import { firebaseAnalyticsRepository } from "../../../infrastructure/repositories/firebaseAnalyticsRepository";
import { cacheStorage } from "../../../infrastructure/cache/cacheStorage";

const getAnalyticsCacheKey = (userId) => `analytics:${userId}`;

export const loadAnalytics = createAsyncThunk(
  "analytics/load",
  async ({ forceRefresh = false } = {}, { rejectWithValue }) => {
    try {
      const user = getCurrentUserUC(firebaseAuthRepository);
      const cacheKey = getAnalyticsCacheKey(user.uid);

      if (!forceRefresh) {
        const cachedAnalytics = await cacheStorage.getItem(cacheKey);

        if (cachedAnalytics) {
          return cachedAnalytics;
        }
      }

      const analytics = await getUserAnalyticsUC(
        firebaseAnalyticsRepository,
        user.uid,
      );

      const analyticsData = analytics.toJSON();

      await cacheStorage.setItem(cacheKey, analyticsData);

      return analyticsData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
