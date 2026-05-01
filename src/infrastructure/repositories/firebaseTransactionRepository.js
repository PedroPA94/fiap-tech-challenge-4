import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

const COLLECTION_NAME = "transactions";

export const firebaseTransactionRepository = {
  getByUserId: async (userId, filters, { limit: pageSize, cursor }) => {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),

      // categoria
      ...(filters.category ? [where("category", "==", filters.category)] : []),

      // intervalo de datas
      ...(filters.startDate ? [where("date", ">=", filters.startDate)] : []),
      ...(filters.endDate ? [where("date", "<=", filters.endDate)] : []),

      orderBy("date", "desc"),
      limit(pageSize),
      ...(cursor ? [startAfter(cursor)] : []),
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    return { data, nextCursor: lastDoc || null };
  },

  getById: async (id) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return {
      id: snapshot.id,
      ...data,
    };
  },

  createTransaction: async (transactionData, context = null) => {
    const ref = collection(db, COLLECTION_NAME);

    if (context) {
      const docRef = doc(ref);
      context.set(docRef, transactionData);
      return docRef.id;
    }

    const docRef = await addDoc(ref, transactionData);
    return docRef.id;
  },

  updateTransaction: async (id, transactionData, context = null) => {
    const ref = collection(db, COLLECTION_NAME);

    if (context) {
      const docRef = doc(ref, id);
      context.update(docRef, transactionData);
      return;
    }

    const docRef = doc(db, COLLECTION_NAME, id);

    await updateDoc(docRef, {
      ...transactionData,
    });
  },
};
