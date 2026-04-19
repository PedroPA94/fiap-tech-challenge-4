import { createContext, useContext, useState, useCallback } from "react";
import { firebaseTransactionRepository } from "../src/infrastructure/repositories/firebaseTransactionRepository";
import { firebaseAuthRepository } from "../src/infrastructure/repositories/firebaseAuthRepository";
import { firebaseReceiptService } from "../src/infrastructure/repositories/services/firebaseReceiptService";
import { getCurrentUser as getCurrentUserUC } from "../src/application/usecases/user";
import {
  createTransaction as createTransactionUC,
  getUserTransactions as getUserTransactionsUC,
  updateTransaction as updateTransactionUC,
} from "../src/application/usecases/transaction";

const TransactionsContext = createContext();

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ordena transações por data (mais recente primeiro)
  const sortTransactions = useCallback((txs) => {
    return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const user = getCurrentUserUC(firebaseAuthRepository);
      const data = await getUserTransactionsUC(
        firebaseTransactionRepository,
        user.uid,
      );
      setTransactions(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || "Erro ao carregar transações";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = useCallback(
    async (transactionData) => {
      setIsLoading(true);
      setError(null);

      try {
        const { receipt, ...data } = transactionData;

        const user = getCurrentUserUC(firebaseAuthRepository);
        const newTransaction = await createTransactionUC(
          firebaseTransactionRepository,
          firebaseReceiptService,
          user.uid,
          data,
          receipt,
        );
        setTransactions((prev) => sortTransactions([...prev, newTransaction]));
        return newTransaction;
      } catch (err) {
        const errorMessage = err.message || "Erro ao criar transação";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [sortTransactions],
  );

  const updateTransaction = useCallback(
    async (id, transactionData) => {
      setIsLoading(true);
      setError(null);

      try {
        const { receipt, ...data } = transactionData;

        const user = getCurrentUserUC(firebaseAuthRepository);
        const updatedTransaction = await updateTransactionUC(
          firebaseTransactionRepository,
          firebaseReceiptService,
          user.uid,
          id,
          data,
          receipt,
        );

        setTransactions((prev) =>
          sortTransactions(
            prev.map((t) => (t.id === id ? updatedTransaction : t)),
          ),
        );

        return updatedTransaction;
      } catch (err) {
        const errorMessage = err.message || "Erro ao atualizar transação";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [sortTransactions],
  );

  const getTransaction = useCallback(
    (id) => {
      return transactions.find((t) => t.id === id);
    },
    [transactions],
  );

  const getTotalBalance = useCallback(() => {
    return transactions.reduce(
      (sum, transaction) => sum + transaction.value,
      0,
    );
  }, [transactions]);

  const value = {
    transactions,
    isLoading,
    error,
    loadTransactions,
    addTransaction,
    updateTransaction,
    getTransaction,
    getTotalBalance,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions deve ser usado dentro de TransactionsProvider",
    );
  }
  return context;
}
