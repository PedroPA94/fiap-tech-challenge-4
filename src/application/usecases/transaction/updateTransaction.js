import { makeTransaction } from "../../../domain/entities/transaction";

export const updateTransaction = async (
  repository,
  receiptService,
  userId,
  transactionId,
  transactionData,
  receipt,
) => {
  if (!transactionId) {
    throw new Error("ID da transação é obrigatório para atualização");
  }

  console.log(
    "Updating transaction with data:",
    transactionData,
    "and receipt:",
    receipt,
  );

  const transaction = makeTransaction({
    ...transactionData,
    id: transactionId,
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

  await repository.updateTransaction(transactionId, transactionDataToPersist);

  if (receipt) {
    await receiptService.updateTransactionReceipt(transactionId, receipt);
  }

  return transaction;
};
