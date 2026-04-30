import { runTransaction } from "firebase/firestore";
import { db } from "../config/firebase";

export const firebaseTransactionManager = {
  run: async (callback) => {
    return await runTransaction(db, async (context) => {
      return callback(context);
    });
  },
};
