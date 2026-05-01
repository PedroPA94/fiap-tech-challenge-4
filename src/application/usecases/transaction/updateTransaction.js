import { makeTransaction } from "../../../domain/entities/transaction";

export const updateTransaction = async (
  transactionRepository,
  summaryRepository,
  analyticsRepository,
  transactionManager,
  receiptService,
  userId,
  transactionId,
  transactionData,
  receipt,
) => {
  if (!transactionId) {
    throw new Error("ID da transação é obrigatório para atualização");
  }

  return await transactionManager.run(async (context) => {
    const oldTransaction = await transactionRepository.getById(transactionId);

    if (!oldTransaction) {
      throw new Error("Transação não encontrada");
    }

    if (oldTransaction.userId !== userId) {
      throw new Error("Não autorizado");
    }

    const newTransaction = makeTransaction({
      ...transactionData,
      id: transactionId,
      userId,
      hasReceipt: !!receipt,
    });

    const transactionDataToPersist = {
      userId: newTransaction.userId,
      description: newTransaction.description,
      value: newTransaction.value,
      type: newTransaction.type,
      category: newTransaction.category,
      hasReceipt: newTransaction.hasReceipt,
      date: newTransaction.date.toISOString(),
    };

    await transactionRepository.updateTransaction(
      transactionId,
      transactionDataToPersist,
      context,
    );

    await summaryRepository.applyTransactionUpdate(
      userId,
      oldTransaction.value,
      newTransaction.value,
      context,
    );

    await analyticsRepository.applyTransactionUpdate(
      userId,
      oldTransaction,
      newTransaction,
      context,
    );

    if (receipt) {
      await receiptService.updateTransactionReceipt(transactionId, receipt);
    }

    return newTransaction;
  });
};
