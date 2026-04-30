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

export const loadTransactions = createAsyncThunk(
  "transactions/load",
  async (_, { rejectWithValue }) => {
    try {
      const user = getCurrentUserUC(firebaseAuthRepository);

      const data = await getUserTransactionsUC(
        firebaseTransactionRepository,
        user.uid,
      );

      return data.map((t) => t.toJSON());
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (transactionData, { rejectWithValue }) => {
    try {
      const { receipt, ...data } = transactionData;

      const user = getCurrentUserUC(firebaseAuthRepository);

      const transaction = await createTransactionUC(
        firebaseTransactionRepository,
        firebaseSummaryRepository,
        firebaseTransactionManager,
        firebaseReceiptService,
        user.uid,
        data,
        receipt,
      );

      return transaction.toJSON();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      const { receipt, ...data } = transactionData;

      const user = getCurrentUserUC(firebaseAuthRepository);

      const transaction = await updateTransactionUC(
        firebaseTransactionRepository,
        firebaseSummaryRepository,
        firebaseTransactionManager,
        firebaseReceiptService,
        user.uid,
        id,
        data,
        receipt,
      );

      return transaction.toJSON();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
