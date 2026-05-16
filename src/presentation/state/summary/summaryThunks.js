import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserSummary as getUserSummaryUC } from "../../../application/usecases/summary/getUserSummary";
import { getCurrentUser as getCurrentUserUC } from "../../../application/usecases/user";
import { cacheStorage } from "../../../infrastructure/cache/cacheStorage";
import { container } from "../../../infrastructure/di/container";

const getSummaryCacheKey = (userId) => `summary:${userId}`;

export const loadSummary = createAsyncThunk(
  "summary/load",
  async ({ forceRefresh = false } = {}, { rejectWithValue }) => {
    try {
      const user = getCurrentUserUC(container.repositories.auth);
      const cacheKey = getSummaryCacheKey(user.uid);

      if (!forceRefresh) {
        const cachedSummary = await cacheStorage.getItem(cacheKey);

        if (cachedSummary) {
          return cachedSummary;
        }
      }

      const summary = await getUserSummaryUC(
        container.repositories.summary,
        user.uid,
      );

      const summaryData = summary.toJSON();

      await cacheStorage.setItem(cacheKey, summaryData);

      return summaryData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
