import { firebaseAuthRepository } from "../repositories/firebaseAuthRepository";
import { firebaseTransactionRepository } from "../repositories/firebaseTransactionRepository";
import { firebaseSummaryRepository } from "../repositories/firebaseSummaryRepository";
import { firebaseAnalyticsRepository } from "../repositories/firebaseAnalyticsRepository";
import { firebaseReceiptService } from "../services/firebaseReceiptService";
import { firebaseTransactionManager } from "../transactional/firebaseTransactionManager";
import { authTokenManager } from "../security/authTokenManager";
import { cacheStorage } from "../cache/cacheStorage";

export const container = {
  repositories: {
    auth: firebaseAuthRepository,
    transaction: firebaseTransactionRepository,
    summary: firebaseSummaryRepository,
    analytics: firebaseAnalyticsRepository,
  },

  services: {
    receipt: firebaseReceiptService,
  },

  transactionManager: firebaseTransactionManager,
  authTokenManager: authTokenManager,
  cacheStorage: cacheStorage,
};
