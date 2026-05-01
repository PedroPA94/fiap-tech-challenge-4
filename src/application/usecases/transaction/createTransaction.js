import { makeTransaction } from "../../../domain/entities/transaction";

export const createTransaction = async (
  transactionRepository,
  summaryRepository,
  analyticsRepository,
  transactionManager,
  receiptService,
  userId,
  transactionData,
  receipt,
) => {
  return await transactionManager.run(async (context) => {
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

    const newTransactionId = await transactionRepository.createTransaction(
      {
        ...transactionDataToPersist,
      },
      context,
    );

    await summaryRepository.applyTransactionCreation(
      userId,
      transaction.value,
      context,
    );

    await analyticsRepository.applyTransactionCreation(
      userId,
      transaction,
      context,
    );

    if (receipt) {
      await receiptService.attachToTransaction(newTransactionId, receipt);
    }

    return transaction.updateId(newTransactionId);
  });
};
