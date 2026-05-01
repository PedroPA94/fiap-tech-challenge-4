import { makeAnalytics } from "../../../domain/entities/analytics";

export const getUserAnalytics = async (analyticsRepository, userId) => {
  if (!userId) {
    throw new Error("UserId é obrigatório");
  }

  const data = await analyticsRepository.getByUserId(userId);

  if (!data) {
    return makeAnalytics({
      userId,
      expensesByCategory: {},
      monthlyCashFlow: {},
    });
  }

  return makeAnalytics({ ...data, userId });
};
