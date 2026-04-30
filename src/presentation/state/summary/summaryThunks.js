import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserSummary as getUserSummaryUC } from "../../../application/usecases/summary/getUserSummary";
import { getCurrentUser as getCurrentUserUC } from "../../../application/usecases/user";
import { firebaseAuthRepository } from "../../../infrastructure/repositories/firebaseAuthRepository";
import { firebaseSummaryRepository } from "../../../infrastructure/repositories/firebaseSummaryRepository";

export const loadSummary = createAsyncThunk(
  "summary/load",
  async (_, { rejectWithValue }) => {
    try {
      const user = getCurrentUserUC(firebaseAuthRepository);

      const data = await getUserSummaryUC(firebaseSummaryRepository, user.uid);

      return data.toJSON();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
