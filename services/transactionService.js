import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { processReceipt } from "../src/infrastructure/repositories/services/processReceipt";
import { makeTransaction } from "../src/domain/entities/transaction";

const COLLECTION_NAME = "transactions";

export const transactionService = {
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
