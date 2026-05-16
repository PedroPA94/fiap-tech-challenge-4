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

const parseFilterDate = (date) => {
  if (!date) return null;

  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof date === "string") {
    const [day, month, year] = date.split("/");

    if (!day || !month || !year) {
      return null;
    }

    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  return null;
};

const getStartOfDayIso = (date) => {
  const parsedDate = parseFilterDate(date);

  if (!parsedDate) {
    return null;
  }

  const d = new Date(parsedDate);
  d.setHours(0, 0, 0, 0);

  return d.toISOString();
};

const getEndOfDayIso = (date) => {
  const parsedDate = parseFilterDate(date);

  if (!parsedDate) {
    return null;
  }

  const d = new Date(parsedDate);
  d.setHours(23, 59, 59, 999);

  return d.toISOString();
};
export const firebaseTransactionRepository = {
  getByUserId: async (userId, filters = {}, { limit: pageSize, cursor }) => {
    const startDate = getStartOfDayIso(filters?.date);
    const endDate = getEndOfDayIso(filters?.date);

    const dateFilter =
      startDate && endDate
        ? {
            startDate,
            endDate,
          }
        : null;
    let constraints = [
      where("userId", "==", userId),

      ...(filters?.category ? [where("category", "==", filters.category)] : []),

      ...(dateFilter ? [where("date", ">=", dateFilter.startDate)] : []),

      ...(dateFilter ? [where("date", "<=", dateFilter.endDate)] : []),

      orderBy("date", "desc"),
      limit(pageSize),
    ];

    if (cursor) {
      const cursorRef = doc(db, COLLECTION_NAME, cursor);
      const cursorSnap = await getDoc(cursorRef);

      if (cursorSnap.exists()) {
        constraints.push(startAfter(cursorSnap));
      }
    }

    const q = query(collection(db, COLLECTION_NAME), ...constraints);

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    return {
      data,
      nextCursor: lastDoc ? lastDoc.id : null,
    };
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
