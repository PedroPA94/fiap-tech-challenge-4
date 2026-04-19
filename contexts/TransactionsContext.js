import { createContext, useContext, useState, useCallback } from "react";
import { transactionService } from "../services/transactionService";
import { firebaseTransactionRepository } from "../src/infrastructure/repositories/firebaseTransactionRepository";
import { getUserTransactions } from "../src/application/usecases/transaction/getUserTransactions";
import { getCurrentUser } from "../src/application/usecases/user/getCurrentUser";
import { firebaseAuthRepository } from "../src/infrastructure/repositories/firebaseAuthRepository";
import { createTransaction } from "../src/application/usecases/transaction/createTransaction";
import { firebaseReceiptService } from "../src/infrastructure/repositories/services/firebaseReceiptService";

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
      const user = getCurrentUser(firebaseAuthRepository);
      const data = await getUserTransactions(
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

        const user = getCurrentUser(firebaseAuthRepository);
        const newTransaction = await createTransaction(
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
        const updatedTransaction = await transactionService.updateTransaction(
          id,
          transactionData,
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
