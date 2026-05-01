export const makeAnalytics = (data) => {
  if (!data.userId) {
    throw new Error("userId é obrigatório");
  }

  const expensesByCategory = data.expensesByCategory || {};
  const monthlyCashFlow = data.monthlyCashFlow || {};

  const updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();

  return Object.freeze({
    userId: data.userId,
    expensesByCategory,
    monthlyCashFlow,
    updatedAt,

    getTotalExpenseByCategory(category) {
      return Number(this.expensesByCategory[category] || 0);
    },

    getMonthlyData(monthKey) {
      return (
        this.monthlyCashFlow[monthKey] || {
          income: 0,
          expense: 0,
        }
      );
    },

    getLastMonths(limit = 6) {
      const entries = Object.entries(this.monthlyCashFlow);

      return entries
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .slice(-limit)
        .map(([monthKey, value]) => ({
          monthKey,
          ...value,
        }));
    },

    toJSON() {
      return {
        userId: this.userId,
        expensesByCategory: this.expensesByCategory,
        monthlyCashFlow: this.monthlyCashFlow,
        updatedAt: this.updatedAt.toISOString(),
      };
    },
  });
};
