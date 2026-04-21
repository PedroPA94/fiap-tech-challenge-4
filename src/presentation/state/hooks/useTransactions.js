import { useDispatch, useSelector } from "react-redux";
import {
  loadTransactions,
  addTransaction,
  updateTransaction,
} from "../transactions/transactionsThunks";

import {
  selectTransactions,
  selectTotalBalance,
} from "../transactions/transactionsSelectors";

export const useTransactions = () => {
  const dispatch = useDispatch();

  const transactions = useSelector(selectTransactions);
  const totalBalance = useSelector(selectTotalBalance);

  const isLoading = useSelector((state) => state.transactions.isLoading);
  const error = useSelector((state) => state.transactions.error);

  return {
    transactions,
    totalBalance,
    isLoading,
    error,

    loadTransactions: () => dispatch(loadTransactions()).unwrap(),

    addTransaction: (data) => dispatch(addTransaction(data)).unwrap(),

    updateTransaction: (id, data) =>
      dispatch(updateTransaction({ id, transactionData: data })).unwrap(),
  };
};
