import { addDoc, collection, deleteDoc, getDocs } from "firebase/firestore";
import { processReceipt } from "./processReceipt";
import { encryptionUtils } from "../security/encryptionUtils";
import { db } from "../config/firebase";

const COLLECTION_NAME = "transactions";

export const firebaseReceiptService = {
  attachToTransaction: async (transactionId, receipt) => {
    const processed = await processReceipt(receipt);

    const encryptedBase64 = encryptionUtils.encrypt(processed.base64);

    const receiptRef = collection(
      db,
      COLLECTION_NAME,
      transactionId,
      "receipts",
    );

    await addDoc(receiptRef, {
      base64: encryptedBase64,
      mimeType: processed.mimeType,
      encryptedAt: new Date().toISOString(),
      isEncrypted: true,
    });
  },

  updateTransactionReceipt: async (transactionId, receipt) => {
    const processed = await processReceipt(receipt);

    const encryptedBase64 = encryptionUtils.encrypt(processed.base64);

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
      base64: encryptedBase64,
      mimeType: processed.mimeType,
      encryptedAt: new Date().toISOString(),
      isEncrypted: true,
    });
  },
};
