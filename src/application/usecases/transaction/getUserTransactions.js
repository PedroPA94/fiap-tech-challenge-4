import { makeTransaction } from "../../../domain/entities/transaction";

export const getUserTransactions = async (repository, userId) => {
  const transactions = await repository.getByUserId(userId);

  return transactions
    .map((t) => makeTransaction(t))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};
