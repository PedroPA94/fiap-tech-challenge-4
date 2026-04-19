import { makeTransaction } from "../../../domain/entities/transaction";

export const getTransactionById = async (id, userId, transactionRepository) => {
  if (!id) {
    throw new Error("ID da transação é obrigatório");
  }

  const transaction = await transactionRepository.getById(id);

  if (!transaction) {
    throw new Error("Transação não encontrada");
  }

  if (transaction.userId !== userId) {
    throw new Error("Acesso negado");
  }

  return makeTransaction(transaction);
};
