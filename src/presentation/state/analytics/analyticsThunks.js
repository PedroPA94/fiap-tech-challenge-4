import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser as getCurrentUserUC } from "../../../application/usecases/user";
import { getUserAnalytics as getUserAnalyticsUC } from "../../../application/usecases/analytics/getUserAnalytics";
import { container } from "../../../infrastructure/di/container";

const getAnalyticsCacheKey = (userId) => `analytics:${userId}`;

export const loadAnalytics = createAsyncThunk(
  "analytics/load",
  async ({ forceRefresh = false } = {}, { rejectWithValue }) => {
    try {
      const user = getCurrentUserUC(container.repositories.auth);
      const cacheKey = getAnalyticsCacheKey(user.uid);

      if (!forceRefresh) {
        const cachedAnalytics = await container.cacheStorage.getItem(cacheKey);

        if (cachedAnalytics) {
          return cachedAnalytics;
        }
      }

      const analytics = await getUserAnalyticsUC(
        container.repositories.analytics,
        user.uid,
      );

      const analyticsData = analytics.toJSON();

      await container.cacheStorage.setItem(cacheKey, analyticsData);

      return analyticsData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
