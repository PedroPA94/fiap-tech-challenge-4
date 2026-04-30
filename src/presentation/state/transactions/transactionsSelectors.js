import { createSelector } from "@reduxjs/toolkit";
import { makeTransaction } from "../../../domain/entities/transaction";

const selectTransactionsState = (state) => state.transactions.list;

export const selectTransactions = createSelector(
  [selectTransactionsState],
  (transactions) => {
    return transactions.map(makeTransaction);
  },
);
