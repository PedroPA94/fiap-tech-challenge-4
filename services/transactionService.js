import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { processReceipt } from "../utils/receiptProcessor";
import { makeTransaction } from "../src/domain/entities/transaction";

const COLLECTION_NAME = "transactions";

export const transactionService = {
  loadTransactions: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", user.uid),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((data) => {
        // Filtrar transações inválidas (sem date)
        if (!data.date) {
          console.warn("Transação ignorada: sem data", data);
          return false;
        }
        return true;
      })
      .map((data) => makeTransaction(data))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  addTransaction: async (transactionData) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const { receipt, ...rest } = transactionData;
    const parsedValue = Math.abs(rest.value);

    rest.value = rest.type === "expense" ? -parsedValue : parsedValue;

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...rest,
      userId: user.uid,
      hasReceipt: !!receipt,
    });

    const newTransaction = makeTransaction({
      id: docRef.id,
      ...rest,
      userId: user.uid,
      hasReceipt: !!receipt,
    });

    if (receipt) {
      const processed = await processReceipt(receipt);
      const receiptRef = collection(db, COLLECTION_NAME, docRef.id, "receipts");

      await addDoc(receiptRef, {
        base64: processed.base64,
        mimeType: processed.mimeType,
      });
    }

    return newTransaction;
  },

  updateTransaction: async (id, transactionData) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const { receipt, ...rest } = transactionData;
    const parsedValue = Math.abs(rest.value);

    rest.value = rest.type === "expense" ? -parsedValue : parsedValue;

    const docRef = doc(db, COLLECTION_NAME, id);

    await updateDoc(docRef, {
      ...rest,
      hasReceipt: !!receipt,
    });

    if (receipt) {
      const processed = await processReceipt(receipt);
      const receiptRef = collection(db, COLLECTION_NAME, id, "receipts");

      const snapshot = await getDocs(receiptRef);

      const deletions = snapshot.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletions);

      await addDoc(receiptRef, {
        base64: processed.base64,
        mimeType: processed.mimeType,
      });
    }

    return makeTransaction({
      id,
      ...rest,
      userId: user.uid,
      hasReceipt: !!receipt,
    });
  },

  getTransactionById: async (id) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error("Transação não encontrada");
    }

    const data = snapshot.data();

    if (data.userId !== user.uid) {
      throw new Error("Acesso negado");
    }

    return makeTransaction({
      id: snapshot.id,
      ...data,
    });
  },
};
