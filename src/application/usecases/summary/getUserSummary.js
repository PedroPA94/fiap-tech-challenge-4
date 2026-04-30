import { makeSummary } from "../../../domain/entities/summary";

export const getUserSummary = async (summaryRepository, userId) => {
  if (!userId) {
    throw new Error("UserId é obrigatório");
  }

  const data = await summaryRepository.getByUserId(userId);

  console.log("Summary data:", data); // Log para verificar os dados retornados

  if (!data) {
    return makeSummary({
      userId,
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
    });
  }

  return makeSummary({ ...data, userId });
};
