import { useDispatch, useSelector } from "react-redux";
import {
  loadTransactions,
  addTransaction,
  updateTransaction,
} from "../transactions/transactionsThunks";

import { selectTransactions } from "../transactions/transactionsSelectors";

export const useTransactions = () => {
  const dispatch = useDispatch();

  const transactions = useSelector(selectTransactions);
  const isLoading = useSelector((state) => state.transactions.isLoading);
  const isLoadingMore = useSelector(
    (state) => state.transactions.isLoadingMore,
  );
  const hasMore = useSelector((state) => state.transactions.hasMore);
  const error = useSelector((state) => state.transactions.error);

  return {
    transactions,
    isLoading,
    isLoadingMore,
    hasMore,
    error,

    loadTransactions: () =>
      dispatch(loadTransactions({ loadMore: false })).unwrap(),

    loadMore: () => dispatch(loadTransactions({ loadMore: true })).unwrap(),

    addTransaction: (data) => dispatch(addTransaction(data)).unwrap(),

    updateTransaction: (id, data) =>
      dispatch(updateTransaction({ id, transactionData: data })).unwrap(),
  };
};
