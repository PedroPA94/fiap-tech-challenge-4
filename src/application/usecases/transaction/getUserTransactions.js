import { makeTransaction } from "../../../domain/entities/transaction";

export const getUserTransactions = async (
  repository,
  userId,
  filters,
  { limit = 10, cursor = null },
) => {
  const { data, nextCursor } = await repository.getByUserId(
    userId,
    {
      limit,
      cursor,
    },
    filters,
  );

  return {
    transactions: data.map((t) => makeTransaction(t)),
    nextCursor,
  };
};
