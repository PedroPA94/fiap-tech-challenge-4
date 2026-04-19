import { addDoc, collection, deleteDoc, getDocs } from "firebase/firestore";
import { processReceipt } from "./processReceipt";
import { db } from "../../../firebase/config";

const COLLECTION_NAME = "transactions";

export const firebaseReceiptService = {
  attachToTransaction: async (transactionId, receipt) => {
    const processed = await processReceipt(receipt);
    const receiptRef = collection(
      db,
      COLLECTION_NAME,
      transactionId,
      "receipts",
    );

    await addDoc(receiptRef, {
      base64: processed.base64,
      mimeType: processed.mimeType,
    });
  },

  updateTransactionReceipt: async (transactionId, receipt) => {
    const processed = await processReceipt(receipt);
    const receiptRef = collection(
      db,
      COLLECTION_NAME,
      transactionId,
      "receipts",
    );

    const snapshot = await getDocs(receiptRef);

    const deletions = snapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletions);

    await addDoc(receiptRef, {
      base64: processed.base64,
      mimeType: processed.mimeType,
    });
  },
};
