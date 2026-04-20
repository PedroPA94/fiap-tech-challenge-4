import { useDispatch, useSelector } from "react-redux";
import {
  loadTransactions,
  addTransaction,
  updateTransaction,
} from "../transactions/transactionsThunks";

import { makeTransaction } from "../../../domain/entities/transaction";

export const useTransactions = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.transactions);

  const transactions = state.list.map(makeTransaction);

  const getTransaction = (id) => transactions.find((t) => t.id === id);

  const getTotalBalance = () =>
    transactions.reduce((sum, t) => sum + t.value, 0);

  return {
    transactions,
    isLoading: state.isLoading,
    error: state.error,

    loadTransactions: () => dispatch(loadTransactions()).unwrap(),

    addTransaction: (data) => dispatch(addTransaction(data)).unwrap(),

    updateTransaction: (id, data) =>
      dispatch(updateTransaction({ id, transactionData: data })).unwrap(),

    getTransaction,
    getTotalBalance,
  };
};
