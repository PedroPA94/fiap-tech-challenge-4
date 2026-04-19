import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/config";

const COLLECTION_NAME = "transactions";

export const firebaseTransactionRepository = {
  getByUserId: async (userId) => {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  createTransaction: async (transactionData) => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...transactionData,
    });

    return docRef.id;
  },

  updateTransaction: async (id, transactionData) => {
    const docRef = doc(db, COLLECTION_NAME, id);

    await updateDoc(docRef, {
      ...transactionData,
    });
  },
};
