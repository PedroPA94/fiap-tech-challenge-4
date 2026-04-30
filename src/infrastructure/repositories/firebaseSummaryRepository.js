import { doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const COLLECTION = "summaries";

export const firebaseSummaryRepository = {
  async applyTransactionCreation(userId, value, context = null) {
    const ref = doc(db, COLLECTION, userId);

    if (context) {
      context.set(
        ref,
        {
          totalIncome: value > 0 ? increment(value) : increment(0),
          totalExpenses: value < 0 ? increment(Math.abs(value)) : increment(0),
          balance: increment(value),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      return;
    }

    await setDoc(
      ref,
      {
        totalIncome: value > 0 ? increment(value) : increment(0),
        totalExpenses: value < 0 ? increment(Math.abs(value)) : increment(0),
        balance: increment(value),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  },

  async applyTransactionUpdate(userId, oldValue, newValue, context = null) {
    const ref = doc(db, COLLECTION, userId);

    const incomeDelta =
      (newValue > 0 ? newValue : 0) - (oldValue > 0 ? oldValue : 0);

    const expenseDelta =
      (newValue < 0 ? Math.abs(newValue) : 0) -
      (oldValue < 0 ? Math.abs(oldValue) : 0);

    const balanceDelta = newValue - oldValue;

    if (context) {
      context.update(ref, {
        totalIncome: increment(incomeDelta),
        totalExpenses: increment(expenseDelta),
        balance: increment(balanceDelta),
      });
      return;
    }

    await updateDoc(ref, {
      totalIncome: increment(incomeDelta),
      totalExpenses: increment(expenseDelta),
      balance: increment(balanceDelta),
      updatedAt: new Date().toISOString(),
    });
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
