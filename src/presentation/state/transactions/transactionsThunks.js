import { createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseTransactionRepository } from "../../../infrastructure/repositories/firebaseTransactionRepository";
import { firebaseAuthRepository } from "../../../infrastructure/repositories/firebaseAuthRepository";
import { firebaseReceiptService } from "../../../infrastructure/services/firebaseReceiptService";

import { getCurrentUser as getCurrentUserUC } from "../../../application/usecases/user";
import {
  createTransaction as createTransactionUC,
  getUserTransactions as getUserTransactionsUC,
  updateTransaction as updateTransactionUC,
} from "../../../application/usecases/transaction";
import { firebaseSummaryRepository } from "../../../infrastructure/repositories/firebaseSummaryRepository";
import { firebaseTransactionManager } from "../../../infrastructure/transactional/firebaseTransactionManager";
import { loadSummary } from "../summary/summaryThunks";
import { firebaseAnalyticsRepository } from "../../../infrastructure/repositories/firebaseAnalyticsRepository";
import { loadAnalytics } from "../analytics/analyticsThunks";

export const loadTransactions = createAsyncThunk(
  "transactions/load",
  async ({ loadMore = false } = {}, { getState, rejectWithValue }) => {
    try {
      const user = getCurrentUserUC(firebaseAuthRepository);

      const { cursor, hasMore, filters } = getState().transactions;

      if (loadMore && !hasMore) {
        return { data: [], nextCursor: null, loadMore };
      }

      const result = await getUserTransactionsUC(
        firebaseTransactionRepository,
        user.uid,
        filters,
        {
          limit: 10,
          cursor: loadMore ? cursor : null,
        },
      );

      return {
        data: result.transactions.map((t) => t.toJSON()),
        nextCursor: result.nextCursor,
        loadMore,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (transactionData, { dispatch, rejectWithValue }) => {
    try {
      const { receipt, ...data } = transactionData;

      const user = getCurrentUserUC(firebaseAuthRepository);

      const transaction = await createTransactionUC(
        firebaseTransactionRepository,
        firebaseSummaryRepository,
        firebaseAnalyticsRepository,
        firebaseTransactionManager,
        firebaseReceiptService,
        user.uid,
        data,
        receipt,
      );

      dispatch(loadSummary({ forceRefresh: true }));
      dispatch(loadAnalytics({ forceRefresh: true }));

      return transaction.toJSON();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, transactionData }, { dispatch, rejectWithValue }) => {
    try {
      const { receipt, ...data } = transactionData;

      const user = getCurrentUserUC(firebaseAuthRepository);

      const transaction = await updateTransactionUC(
        firebaseTransactionRepository,
        firebaseSummaryRepository,
        firebaseAnalyticsRepository,
        firebaseTransactionManager,
        firebaseReceiptService,
        user.uid,
        id,
        data,
        receipt,
      );

      dispatch(loadSummary({ forceRefresh: true }));
      dispatch(loadAnalytics({ forceRefresh: true }));

      return transaction.toJSON();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
