import { makeTransaction } from "../../../domain/entities/transaction";

export const createTransaction = async (
  repository,
  receiptService,
  userId,
  transactionData,
  receipt,
) => {
  const transaction = makeTransaction({
    ...transactionData,
    userId,
    hasReceipt: !!receipt,
  });

  const transactionDataToPersist = {
    userId: transaction.userId,
    description: transaction.description,
    value: transaction.value,
    type: transaction.type,
    category: transaction.category,
    hasReceipt: transaction.hasReceipt,
    date: transaction.date.toISOString(),
  };

  const newTransactionId = await repository.createTransaction({
    ...transactionDataToPersist,
  });

  const newTransaction = transaction.updateId(newTransactionId);

  if (receipt) {
    await receiptService.attachToTransaction(newTransactionId, receipt);
  }

  return newTransaction;
};
