import { doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const COLLECTION = "analytics";

const getMonthKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
};

export const firebaseAnalyticsRepository = {
  async applyTransactionCreation(userId, transaction, context = null) {
    const ref = doc(db, COLLECTION, userId);

    const { value, category, date } = transaction;

    const monthKey = getMonthKey(date);

    const isIncome = value > 0;
    const isExpense = value < 0;

    const updates = {
      [`monthlyCashFlow.${monthKey}.income`]: isIncome
        ? increment(value)
        : increment(0),

      [`monthlyCashFlow.${monthKey}.expense`]: isExpense
        ? increment(Math.abs(value))
        : increment(0),

      updatedAt: new Date().toISOString(),
    };

    if (isExpense) {
      updates[`expensesByCategory.${category}`] = increment(Math.abs(value));
    }

    if (context) {
      context.set(ref, updates, { merge: true });
      return;
    }

    await setDoc(ref, updates, { merge: true });
  },

  async applyTransactionUpdate(
    userId,
    oldTransaction,
    newTransaction,
    context = null,
  ) {
    const ref = doc(db, COLLECTION, userId);

    const oldMonth = getMonthKey(oldTransaction.date);
    const newMonth = getMonthKey(newTransaction.date);

    const updates = {};

    // Remove transação antiga
    if (oldTransaction.value > 0) {
      updates[`monthlyCashFlow.${oldMonth}.income`] = increment(
        -oldTransaction.value,
      );
    } else {
      updates[`monthlyCashFlow.${oldMonth}.expense`] = increment(
        -Math.abs(oldTransaction.value),
      );

      updates[`expensesByCategory.${oldTransaction.category}`] = increment(
        -Math.abs(oldTransaction.value),
      );
    }

    // Aplica transação nova
    if (newTransaction.value > 0) {
      updates[`monthlyCashFlow.${newMonth}.income`] = increment(
        newTransaction.value,
      );
    } else {
      updates[`monthlyCashFlow.${newMonth}.expense`] = increment(
        Math.abs(newTransaction.value),
      );

      updates[`expensesByCategory.${newTransaction.category}`] = increment(
        Math.abs(newTransaction.value),
      );
    }

    updates.updatedAt = new Date().toISOString();

    if (context) {
      context.update(ref, updates);
      return;
    }

    await updateDoc(ref, updates);
  },

  async getByUserId(userId) {
    const ref = doc(db, COLLECTION, userId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return null;
    }

    return snap.data();
  },
};
