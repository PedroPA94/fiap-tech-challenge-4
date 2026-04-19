import { addDoc, collection } from "firebase/firestore";
import { processReceipt } from "./processReceipt";
import { db } from "../../../../firebase/config";

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
};
