import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser as getCurrentUserUC } from "../../../application/usecases/user";
import {
  createTransaction as createTransactionUC,
  getUserTransactions as getUserTransactionsUC,
  updateTransaction as updateTransactionUC,
} from "../../../application/usecases/transaction";
import { loadSummary } from "../summary/summaryThunks";
import { loadAnalytics } from "../analytics/analyticsThunks";
import { container } from "../../../infrastructure/di/container";

export const loadTransactions = createAsyncThunk(
  "transactions/load",
  async ({ loadMore = false } = {}, { getState, rejectWithValue }) => {
    try {
      const user = getCurrentUserUC(container.repositories.auth);

      const { cursor, hasMore, filters } = getState().transactions;

      if (loadMore && !hasMore) {
        return { data: [], nextCursor: null, loadMore };
      }

      const result = await getUserTransactionsUC(
        container.repositories.transaction,
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

      const user = getCurrentUserUC(container.repositories.auth);

      const transaction = await createTransactionUC(
        container.repositories.transaction,
        container.repositories.summary,
        container.repositories.analytics,
        container.transactionManager,
        container.services.receipt,
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

      const user = getCurrentUserUC(container.repositories.auth);

      const transaction = await updateTransactionUC(
        container.repositories.transaction,
        container.repositories.summary,
        container.repositories.analytics,
        container.transactionManager,
        container.services.receipt,
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
